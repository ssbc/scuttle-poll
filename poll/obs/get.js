const pull = require('pull-stream')
const PullNotify = require('pull-notify')
const Cat = require('pull-cat')
const sort = require('ssb-sort')
const { Struct, Value, Array: MutantArray, when, computed, resolve } = require('mutant')
const getContent = require('ssb-msg-content')
const { isPoll, isPosition, isChooseOnePoll, isPollUpdate, isChooseOnePosition, parsePollUpdate } = require('ssb-poll-schema')
isPoll.chooseOne = isChooseOnePoll
isPosition.chooseOne = isChooseOnePosition
const buildResults = require('../../results/sync/buildResults')
const { CHOOSE_ONE, ERROR_POSITION_TYPE } = require('../../types')
const publishChooseOnePosition = require('../../position/async/buildChooseOne')

// PollDoc is a mutant that initially only has the value sync false
// Which things need to be observabel?
//  - Positions
//    - Errors (these are the position errors that are not valid positions that should still be displayed somehow)
//  - ClosesAt
//  - Results (but that's computed from positions & closing time.
//
// Things that are not observable and can all live in one Value which will get set just once.:
//  - title, author, body, channel, mentions, recps, the original poll message.
//  {
//    sync: boolean, (initially false until the value gets set)
//    poll: MutantValue({
//      title: '',
//      author: '',
//      body: '',
//      channel: '',
//      mentions: '',
//      recps: '',
//      value: {...poll msg}
//    }),
//    closesAt: MutantValue('date string'),
//    positions: MutantArray(), (sorted in causal order)
//    results: MutantStruct(),A computed obs of positions
//    errors
//  }
//  The shape of this object is different to the one returned by async.get. Ugh.

module.exports = function (server) {
  return function get (key) {
    const myKey = server.id

    const positions = MutantArray([])
    const myPositions = MutantArray([])
    const closingTimes = MutantArray([])
    const sortedClosingTimes = computed(closingTimes, sort)
    const sortedPositions = computed(positions, sort)
    const closesAt = computed(sortedClosingTimes, (times) => {
      const time = times.pop()
      return time ? time.value.content.closesAt : ''
    })
    const myPosition = computed(myPositions, (positions) => {
      const sortedPositions = sort(positions)
      return sortedPositions.pop()
    })

    const poll = Value({})
    const results = computed(sortedPositions, (positions) => {
      const resultsErrors = buildResults({ poll: resolve(poll), positions })
      return resultsErrors ? resultsErrors.results : {}
    })

    const errors = computed(sortedPositions, (positions) => {
      const resultsErrors = buildResults({ poll: resolve(poll), positions })
      return resultsErrors ? resultsErrors.errors : {}
    })

    const pollDoc = Struct(PollDoc({
      sync: false,
      positions: sortedPositions,
      closesAt,
      results,
      errors,
      poll,
      myPosition
    }))

    // sortedPositions(console.log)
    // pollDoc.sync(console.log)
    // pollDoc.results(console.log)
    // pollDoc(console.log)
    // pollDoc.myPosition(console.log)

    server.get(key, (err, value) => {
      if (err) return err

      var poll = { key, value }
      if (!isPoll(poll)) return new Error('scuttle-poll could not get poll, key provided was not a valid poll key')

      setImmediate(function () {
        pollDoc.poll.set(decoratePoll(poll))

        const refs = PullNotify()

        pull(
          createBacklinkStream(key),
          pull.drain(refs)
        )

        pull(
          refs.listen(),
          pull.filter(isPosition[CHOOSE_ONE]), // TODO: this shouldn't be hard coded
          pull.map(position => {
            return decoratePosition({position, poll})
          }),
          pull.drain((position) => {
            positions.push(position)
          })
        )

        const updatedTimes = pull(
          refs.listen(),
          pull.filter(isPollUpdate)
        )
        pull(
          Cat([pull.once(poll), updatedTimes]),
          pull.drain(at => closingTimes.push(at))
        )

        pull(
          refs.listen(),
          pull.filter(isPosition[CHOOSE_ONE]),
          pull.filter(position => position.value.author === myKey),
          pull.drain(mine => myPositions.push(mine))
        )

        pollDoc.sync.set(true)
      })
    })
    return pollDoc
  }

  function createBacklinkStream (key) {
    var filterQuery = {
      $filter: {
        dest: key
      }
    }

    return server.backlinks.read({
      query: [filterQuery],
      live: true,
      index: 'DTA' // use asserted timestamps
    })
  }
}

function decoratePoll (rawPoll) {
  const {
    author,
    content: {
      title,
      body,
      channel,
      details: { type }
    },
    recps,
    mentions
  } = rawPoll.value

  const poll = Object.assign({}, rawPoll, {
    type,
    author,
    title,
    body,
    channel,
    recps,
    mentions
  })

  return poll
}

function PollDoc (opts) {
  return Object.assign({
    author: '',
    type: '',
    title: '',
    body: '',
    channel: '',
    recps: [],
    mentions: []
    // value?

  }, opts)
}

function decoratePosition ({position: rawPosition, poll: rawPoll}) {
  var position = getContent(rawPosition)
  var poll = getContent(rawPoll)

  // NOTE this isn't deep enough to be a safe clone
  var newPosition = Object.assign({}, rawPosition)
  newPosition.reason = position.reason

  if (isPoll.chooseOne(poll)) {
    var choiceIndex = position.details.choice
    newPosition.choice = poll.details.choices[choiceIndex]
  }
  return newPosition
}
