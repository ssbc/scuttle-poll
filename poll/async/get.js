const pull = require('pull-stream')
const sort = require('ssb-sort')
const isPoll = require('../../isPoll')
const isPosition = require('../../isPosition')
const { CHOOSE_ONE, ERROR_POSITION_TYPE } = require('../../types')
const getResults = require('../../position/sync/chooseOneResults')
const publishChooseOnePosition = require('../../position/async/chooseOne')
const getMsgContent = require('../../lib/getMsgContent')

module.exports = function (server) {
  return function get (key, cb) {
    server.get(key, (err, value) => {
      if (err) return cb(err)

      var poll = { key, value }
      if (!isPoll(poll)) return cb(new Error('scuttle-poll could not get poll, key provided was not a valid poll key'))

      pull(
        createBacklinkStream(key),
        pull.collect((err, msgs) => {
          if (err) return cb(err)

          cb(null, decoratedPoll(poll, msgs))
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

function decoratedPoll (rawPoll, msgs = []) {
  const {
    author,
    content: {
      title,
      body,
      channel,
      details: { type }
    }
  } = rawPoll.value

  const poll = Object.assign({}, rawPoll, {
    type,
    author,
    title,
    body,
    channel,

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

  // TODO add missingContext warnings to each msg
  msgs = sort(msgs)

  poll.positions = msgs
    .filter(msg => msg.value.content.root === poll.key)
    .filter(isPosition[type])
    .map(position => {
      return decoratePosition({position, poll})
    })

  poll.errors = msgs
    .filter(msg => msg.value.content.root === poll.key)
    .filter(msg => isPosition(msg) && !isPosition[type](msg))
    .map(position => {
      return {
        type: ERROR_POSITION_TYPE,
        message: `Position responses need to be off the ${type} type for this poll`,
        position
      }
    })

  const {results, errors} = getResults({ poll, positions: poll.positions })
  poll.results = results
  poll.errors = poll.errors.concat(errors)

  return poll
}

function decoratePosition ({position: rawPosition, poll: rawPoll}) {
  var position = getMsgContent(rawPosition)
  var poll = getMsgContent(rawPoll)

  // NOTE this isn't deep enough to be a safe clone
  var newPosition = Object.assign({}, rawPosition)

  if (isPoll.chooseOne(poll)) {
    var choiceIndex = position.details.choice
    newPosition.choice = poll.details.choices[choiceIndex]
  }
  return newPosition
}
