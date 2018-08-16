const MeetingTime = require('../sync/buildMeetingTime')
const { isPoll, getPollErrors } = require('ssb-poll-schema')

module.exports = function (server) {
  return function publishMeetingTime (opts, cb) {
    const poll = MeetingTime(opts)
    if (!isPoll.meetingTime(poll)) return cb(getPollErrors(poll))

    server.publish(poll, cb)
  }
}
