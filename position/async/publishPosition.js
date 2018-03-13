const buildPosition = require('../async/buildPosition')

module.exports = function (server) {
  return function publishPosition ({ poll, details, reason, mentions }, cb) {
    buildPosition(server)({ poll, details, reason, mentions }, (err, position) => {
      if (err) return cb(err)

      server.publish(position, cb)
    })
  }
}
