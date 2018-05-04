const ChooseOne = require('../sync/buildChooseOne')
const { isPoll, getPollErrors } = require('ssb-poll-schema')

module.exports = function (server) {
  return function publishChooseOne (opts, cb) {
    const poll = ChooseOne(opts)
    if (!isPoll.chooseOne(poll)) return cb(getPollErrors(poll))

    server.publish(poll, cb)
  }
}
