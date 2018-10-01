const { isMsg } = require('ssb-ref')

module.exports = function (server) {
  return function pollUpdates (key) {
    if (!isMsg(key)) throw new Error('scuttle-poll: poll.pull.updates expects a msg-key')

    const opts = {
      live: true,
      old: false,
      query: [{
        $filter: {
          dest: key
          // drop this to trigger update on gathering creation
          // value: {
          //   content: { root: key }
          // }
        }
      }, {
        $map: {
          key: ['key'],
          type: ['value', 'content', 'type']
        }
      }]
    }

    return server.backlinks.read(opts)
  }
}
