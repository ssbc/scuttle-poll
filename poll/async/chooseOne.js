const ChooseOne = require('../sync/chooseOne')
const isPoll = require('../../isPoll')

module.exports = function (server) {
  return function publishChooseOne (opts, cb) {
    const poll = ChooseOne(opts)
    if (!isPoll.chooseOne(poll)) return cb(isPoll.chooseOne.errors)

    server.publish(poll, cb)
  }
}
