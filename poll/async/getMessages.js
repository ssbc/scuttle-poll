const sort = require('ssb-sort')
const { isMsg } = require('ssb-ref')
const pull = require('pull-stream')
const getContent = require('ssb-msg-content')

module.exports = function (server) {
  return function getMessages (poll, cb) {
    if (typeof poll === 'object') poll = poll.key
    if (!isMsg(poll)) return cb(new Error('getMessages expects a valid poll message id'))

    pull(
      backlinksSource(poll),
      pull.collect((err, msgs) => {
        if (err) return cb(err)

        const _msgs = msgs.reduce((acc, msg) => {
          if (getContent(msg).root === poll) acc.thread.push(msg)
          else acc.backlinks.push(msg)

          return acc
        }, { thread: [], backlinks: [] })

        _msgs.thread = sort(_msgs.thread)

        cb(null, _msgs)
      })
    )

    function backlinksSource (key) {
      var filterQuery = {
        $filter: {
          dest: key
          // disabled this in order to pick up gatherings backlinking
          // value: {
          //   content: { root: key }
          // }
        }
      }

      return server.backlinks.read({
        query: [filterQuery],
        index: 'DTA' // use asserted timestamps
      })
    }
  }
}
