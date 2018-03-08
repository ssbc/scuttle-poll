const pull = require('pull-stream')
const sort = require('ssb-sort')
const isPoll = require('../../isPoll')
const isPosition = require('../../isPosition')
const { ERROR_POSITION_TYPE } = require('../../types')
const results = require('../../position/sync/chooseOneResults')

module.exports = function (server) {
  return function get (key, cb) {
    server.get(key, (err, value) => {
      if (err) return cb(err)

      var poll = { key, value }
      if (!isPoll(poll)) return cb(new Error('scuttle-poll could not fetch, key provided was not a valid poll key'))

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
  const { author, content: { title, body } } = rawPoll.value

  const poll = Object.assign({}, rawPoll, {
    author,
    title,
    body,

    positions: [],
    results: {},
    errors: []

    // publishPosition:  TODO ? add pre-filled helper functions to the poll?
  })

  // TODO add missingContext warnings to each msg
  msgs = sort(msgs)

  // filter position message into 'positions' and 'errors'
  const type = poll.value.content.pollDetails.type

  poll.positions = msgs
    .filter(msg => msg.value.content.root === poll.key)
    .filter(isPosition[type])

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

  poll.results = results({ poll, positions: poll.positions })

  return poll
}
