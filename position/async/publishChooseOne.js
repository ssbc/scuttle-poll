const buildChooseOne = require('./buildChooseOne')

module.exports = function (server) {
  return function publishChooseOne ({ poll, choice, reason, mentions }, cb) {
    buildChooseOne(server)({ poll, choice, reason, mentions }, (err, position) => {
      if (err) return cb(err)

      server.publish(position, cb)
    })
  }
}
