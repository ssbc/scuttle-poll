const pull = require('pull-stream')
const sort = require('ssb-sort')
const isPoll = require('../../isPoll')

module.exports = function (server) {
  return function get (key, cb) {
    server.get(key, (err, poll) => {
      if (err) return cb(err)
      if (!isPoll(poll)) return cb(new Error('scuttle-poll could not fetch, key provided was not a valid poll key'))

      pull(
        createBacklinkStream(key),
        pull.collect(msgs => {
          msgs = sort(msgs)
          // TODO add missingContext warnings

          Object.assign({}, poll, {
            key,
            value: poll,
            title: poll.content.title,
            body: poll.content.body,

            // positions: msgs.filter,
            results: {}, // TODO add reduction of positions
            errors: {}
          })
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
