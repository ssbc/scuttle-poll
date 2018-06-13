const pull = require('pull-stream')
const pullMerge = require('pull-merge')
const paramap = require('pull-paramap')
const next = require('pull-next-query')
const clone = require('lodash.clonedeep')
const merge = require('lodash.merge')

module.exports = function (server) {
  return function MyPollsStream (opts) {
    const myKey = server.id

    const _opts = clone(opts)
    const postsSeen = new Set()

    const pollStream = pull(
      next(server.query.read, optsForType('poll')),
      pull.filter(m => !postsSeen.has(m.key)),
      pull.through(m => postsSeen.add(m.key))
    )

    const positionStream = pull(
      next(server.query.read, optsForType('position')),
      pull.map(getRoot),
      pull.filter(root => Boolean(root) && !postsSeen.has(root)),
      pull.through(root => postsSeen.add(root)),
      // pull.asyncMap((root, cb) => {
      paramap((root, cb) => {
        server.get(root, (err, value) => {
          if (err) return console.err(err)
          cb(null, { key: root, value })
        })
      }, 5)
    )

    return pullMerge(
      pollStream,
      positionStream,
      Comparer(opts)
    )

    function optsForType (type) {
      const defaultOpts = {
        limit: 100,
        query: [{
          $filter: {
            value: {
              author: myKey,
              timestamp: { $gt: 0 },
              content: { type }
            }
          }
        }]
      }

      return merge({}, defaultOpts, _opts)
    }
  }
}

function Comparer (opts) {
  return (a, b) => {
    if (opts.reverse) {
      return a.value.timestamp > b.value.timestamp ? -1 : +1
    } else {
      return a.value.timestamp < b.value.timestamp ? -1 : +1
    }
  }
}

function getRoot (position) {
  return position.value.content.root
}
