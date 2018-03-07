const pull = require('pull-stream')
const sort = require('ssb-sort')
const isPoll = require('../../isPoll')

module.exports = function (server) {
  return function get (key, cb) {
    server.get(key, (err, value) => {
      if (err) return cb(err)

      var poll = { key, value }
      if (!isPoll(poll)) return cb(new Error('scuttle-poll could not fetch, key provided was not a valid poll key'))

      pull(
        createBacklinkStream(key),
        pull.collect(msgs => {
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

function decoratedPoll (poll, msgs) {
  msgs = sort(msgs)
  // TODO add missingContext warnings

  const pollType = poll.pollDetails.type
  // const pollType = poll.details.type

  const positions = msgs.filter(isPoll[pollType])

  return Object.assign({}, poll, {
    title: poll.content.title,
    body: poll.content.body,

    // positions: msgs.filter,
    results: {}, // TODO add reduction of positions
    errors: {}
  })
}
