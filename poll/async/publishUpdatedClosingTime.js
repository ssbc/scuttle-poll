const buildUpdatedClosingTime = require('../async/buildUpdatedClosingTime')

module.exports = function (server) {
  return function publishUpdatedClosingTime ({ poll, closesAt }, cb) {
    buildUpdatedClosingTime(server)({ poll, closesAt }, (err, content) => {
      if (err) return cb(err)

      server.publish(content, cb)
    })
  }
}
