const ChooseOne = require('../sync/chooseOne')
const { isPoll } = require('ssb-poll-schema')

module.exports = function (server) {
  return function publishChooseOne (opts, cb) {
    const poll = ChooseOne(opts)
    console.log('poll', poll)
    console.log('isChooseOnePoll', require('../../isPoll'))
    if (!isPoll.chooseOne(poll)) return cb(isPoll.chooseOne.errors)

    server.publish(poll, cb)
  }
}
