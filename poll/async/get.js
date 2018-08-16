const pull = require('pull-stream')
const sort = require('ssb-sort')
const getContent = require('ssb-msg-content')
const { isPoll, isPosition, isPollUpdate, parsePollUpdate } = require('ssb-poll-schema')

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
        backlinksSource(key),
        pull.collect((err, msgs) => {
          if (err) return cb(err)

          cb(null, decoratePoll(poll, sort(msgs), myKey))
        })
      )
    })
  }

  function backlinksSource (key) {
    var filterQuery = {
      $filter: {
        dest: key,
        value: {
          content: { root: key }
        }
      }
    }

    return server.backlinks.read({
      query: [filterQuery],
      index: 'DTA' // use asserted timestamps
    })
  }
}

function decoratePoll (poll, msgs = [], myKey) {
  const {
    author,
    content: {
      title,
      body,
      channel,
      details: {
        type,
        closesAt
      },
      recps,
      mentions
    },
  } = poll.value

  const pollDoc = Object.assign({}, poll, {
    type,
    closesAt: getClosesAt(msgs, closesAt),
    author,
    title,
    body,
    channel,
    recps,
    mentions,

    positions: [],
    results: {},
    errors: [],
    decorated: true
  })

  // TODO add missingContext warnings to each msg

  pollDoc.positions = msgs
    .filter(isPosition[type])
    .map(position => {
      return decoratePosition({position, poll: pollDoc})
    })

  pollDoc.myPosition = pollDoc.positions
    .filter(p => p.value.author === myKey)
    .sort((a, b) => {
      return a.value.timestamp > b.value.timestamp ? -1 : +1
    })[0]

  const { results, errors } = buildResults({ poll, positions: pollDoc.positions })
  pollDoc.results = results
  pollDoc.errors = errors || []

  return pollDoc
}

function getClosesAt (msgs, closesAt) {
  const update = msgs
    .filter(isPollUpdate)
    .pop()

  if (update) return new Date(parsePollUpdate(update).closesAt)

  return new Date(closesAt)
}

function decoratePosition ({position, poll}) {
  const { details, reason } = getContent(position)

  // NOTE this isn't deep enough to be a safe clone
  var newPosition = Object.assign({ reason }, position)

  if (isPoll.chooseOne(poll)) {
    var choiceIndex = details.choice
    newPosition.choice = getContent(poll).details.choices[choiceIndex]
  }
  return newPosition
}

