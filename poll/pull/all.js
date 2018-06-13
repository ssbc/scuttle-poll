const next = require('pull-next-query')

module.exports = function (server) {
  return function AllPollsStream (opts) {
    const defaultOpts = {
      limit: 100,
      query: [{
        $filter: {
          value: {
            timestamp: { $gt: 0 },
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
