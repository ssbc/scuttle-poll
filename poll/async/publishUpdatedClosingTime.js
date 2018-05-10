const buildUpdatedClosingTime = require('../async/buildUpdatedClosingTime')

module.exports = function (server) {
  return function publishUpdatedClosingTime ({ poll, closesAt }, cb) {
    buildUpdatedClosingTime(server)({ poll, closesAt }, (err, position) => {
      if (err) return cb(err)

      server.publish(position, cb)
    })
  }
}
