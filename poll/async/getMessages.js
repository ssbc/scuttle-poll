const sort = require('ssb-sort')
const { isMsg } = require('ssb-ref')
const pull = require('pull-stream')

module.exports = function (server) {
  return function getMessages (poll, cb) {
    if (typeof poll === 'object') poll = poll.key
    if (!isMsg(poll)) return cb(new Error('getMessages expects a valid poll message id'))

    pull(
      backlinksSource(poll),
      pull.collect((err, msgs) => {
        if (err) return cb(err)

        cb(null, sort(msgs))
      })
    )

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
}
