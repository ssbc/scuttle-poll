const pull = require('pull-stream')
const sort = require('ssb-sort')
const getContent = require('ssb-msg-content')
const { isPoll, isPosition, isChooseOnePoll, isPollUpdate, isChooseOnePosition, parsePollUpdate } = require('ssb-poll-schema')
isPoll.chooseOne = isChooseOnePoll
isPosition.chooseOne = isChooseOnePosition
const buildResults = require('../../results/sync/buildResults')
const { CHOOSE_ONE, ERROR_POSITION_TYPE } = require('../../types')
const publishChooseOnePosition = require('../../position/async/publishChooseOne')

module.exports = function (server) {
  return function get (key, cb) {
    const myKey = server.id

    server.get(key, (err, value) => {
      if (err) return cb(err)

      var poll = { key, value }
      if (!isPoll(poll)) return cb(new Error('scuttle-poll could not get poll, key provided was not a valid poll key'))

      pull(
        createBacklinkStream(key),
        pull.collect((err, msgs) => {
          if (err) return cb(err)

          cb(null, decoratePoll(poll, msgs, myKey))
        })
      )
    })
  }

  function createBacklinkStream (key) {
    var filterQuery = {
      $filter: {
        dest: key
      }
    }

    return server.backlinks.read({
      query: [filterQuery],
      index: 'DTA' // use asserted timestamps
    })
  }
}

function decoratePoll (rawPoll, msgs = [], myKey) {
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
    mentions,

    actions: {
      publishPosition
    },
    positions: [],
    results: {},
    errors: [],
    decorated: true
  })

  function publishPosition (opts, cb) {
    if (poll.type === CHOOSE_ONE) {
      publishChooseOnePosition({
        poll,
        choice: opts.choice,
        reason: opts.reason
      }, cb)
    }
  }

  function doesMsgRefPoll (msg) {
    return msg.value.content.root === poll.key
  }

  // TODO add missingContext warnings to each msg
  msgs = sort(msgs)

  const latestClosingTime = msgs
    .filter(doesMsgRefPoll)
    .filter(isPollUpdate)
    .map(msg => parsePollUpdate(msg).closesAt)
    .pop()

  if (latestClosingTime) poll.closesAt = latestClosingTime

  poll.positions = msgs
    .filter(doesMsgRefPoll)
    .filter(isPosition[type])
    .map(position => {
      return decoratePosition({position, poll})
    })

  poll.myPosition = poll.positions
    .filter(p => p.value.author === myKey)
    .sort((a, b) => {
      return a.value.timestamp > b.value.timestamp ? -1 : +1
    })[0]

  poll.errors = msgs
    .filter(doesMsgRefPoll)
    .filter(msg => isPosition(msg) && !isPosition[type](msg))
    .map(position => {
      return {
        type: ERROR_POSITION_TYPE,
        message: `Position responses need to be of the ${type} type for this poll`,
        position
      }
    })

  const {results, errors} = buildResults({ poll, positions: poll.positions })
  poll.results = results
  poll.errors = poll.errors.concat(errors)

  return poll
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
