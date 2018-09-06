const Resolution = require('../async/buildResolution')

module.exports = function (server) {
  return function publishResolution ({ poll, choices, body, mentions, recps }, cb) {
    Resolution(server)({ poll, choices, body, mentions, recps }, (err, content) => {
      if (err) return cb(err)

      server.publish(content, cb)
    })
  }
}
