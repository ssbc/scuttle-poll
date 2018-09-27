const getContent = require('ssb-msg-content')
const { isPoll, isPosition, isPollUpdate, parsePollUpdate, isPollResolution, parsePollResolution } = require('ssb-poll-schema')

const buildResults = require('../../results/sync/buildResults')
const getMessages = require('./getMessages')
const getHeads = require('../sync/getHeads')

module.exports = function (server) {
  return function get (key, cb) {
    const myKey = server.id

    server.get(key, (err, value) => {
      if (err) return cb(err)

      var poll = { key, value }
      if (!isPoll(poll)) return cb(new Error('scuttle-poll could not get poll, key provided was not a valid poll key'))

      getMessages(server)(key, (err, msgs) => {
        if (err) return cb(err)

        cb(null, decoratePoll(poll, msgs, myKey))
      })
    })
  }
}

function decoratePoll (poll, msgs = { thread: [], backlinks: [] }, myKey) {
  const {
    author,
    content: {
      title,
      closesAt,
      body,
      channel,
      details: { type },
      recps = [],
      mentions = []
    }
  } = poll.value

  const { thread, backlinks } = msgs

  const pollDoc = Object.assign({}, poll, {
    author,
    title,
    closesAt: getClosesAt(thread, closesAt),
    type,
    body,
    channel,
    recps,
    mentions,

    positions: [],
    results: {},
    resolution: getResolution(poll, thread),
    errors: [],
    heads: getHeads(poll, thread),
    backlinks,
    decorated: true
  })

  // TODO add missingContext warnings to each msg

  pollDoc.positions = thread
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

function getClosesAt (thread, closesAt) {
  const update = thread
    .filter(isPollUpdate)
    .pop()

  if (update) return new Date(parsePollUpdate(update).closesAt)

  return new Date(closesAt)
}

function getResolution (poll, thread) {
  const author = poll.value.author
  const resolution = thread
    .filter(m => m.value.author === author)
    .filter(isPollResolution)
    .pop()

  if (resolution) return parsePollResolution(resolution)
}

function decoratePosition ({position, poll}) {
  const { details, reason } = getContent(position)

  // NOTE this isn't deep enough to be a safe clone
  var newPosition = Object.assign({ reason }, position)

  const pollChoices = getContent(poll).details.choices

  if (isPoll.meetingTime(poll)) {
    newPosition.choices = details.choices.map(i => pollChoices[i])
  }

  if (isPoll.chooseOne(poll)) {
    newPosition.choice = pollChoices[details.choice]
  }
  return newPosition
}
