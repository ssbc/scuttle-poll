const buildMeetingTime = require('./buildMeetingTime')

module.exports = function (server) {
  return function publishtMeetingTime ({ poll, choices, reason, mentions }, cb) {
    buildMeetingTime(server)({ poll, choices, reason, mentions }, (err, position) => {
      if (err) return cb(err)

      server.publish(position, cb)
    })
  }
}
