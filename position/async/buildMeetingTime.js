const getContent = require('ssb-msg-content')
const { isPoll, isPosition } = require('ssb-poll-schema')
const buildPosition = require('./buildPosition')
const { MEETING_TIME, ERROR_POSITION_TYPE } = require('../../types')

module.exports = function (server) {
  const Position = buildPosition(server)

  return function MeetingTime ({ poll, choices, reason, mentions }, cb) {
    if (!isPoll.meetingTime(poll)) return cb(new Error('ChooseOne position factory requires a valid poll'))
    if (!validChoices(poll, choices))
      return cb(new Error({type: ERROR_POSITION_TYPE, message: 'choice outside valid choices range'}))

    const opts = {
      poll,
      details: {
        type: MEETING_TIME,
        choices
      },
      reason,
      mentions
    }

    Position(opts, (err, position) => {
      if (err) return cb(err)
      isPosition.meetingTime(position)
      if (!isPosition.meetingTime(position)) return cb(isPosition.meetingTime.errors)

      cb(null, position)
    })
  }
}

function validChoices (poll, choices) {
  const maxChoice = getContent(poll).details.choices.length - 1

  return choices.every(choice => choice <= maxChoice)
}
