var next = require('pull-next-query')

module.exports = function (server) {
  return function AllPollsStream (opts) {
    const defaultOpts = {
      limit: 100,
      query: [{
        $filter: {
          value: {
            timestamp: { $gt: 0 }, // this forces ssb query to stream in order of message published timestamp.
            content: {
              type: 'poll'
            }
          }
        }
      }]
    }
    const _opts = Object.assign({}, defaultOpts, opts)

    return next(server.query.read, _opts)
  }
}
