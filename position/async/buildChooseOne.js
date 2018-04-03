const getContent = require('ssb-msg-content')
const { isPoll, isPosition } = require('ssb-poll-schema')
const buildPosition = require('./buildPosition')
const { CHOOSE_ONE, ERROR_POSITION_TYPE } = require('../../types')

module.exports = function (server) {
  const Position = buildPosition(server)

  return function ChooseOne ({ poll, choice, reason, mentions }, cb) {
    if (!isPoll(poll)) return cb(new Error('ChooseOne position factory requires a valid poll'))
    if (choice >= getContent(poll).details.choices.length) return cb(new Error({type: ERROR_POSITION_TYPE, message: 'choice outside valid choices range'}))

    const opts = {
      poll,
      details: {
        type: CHOOSE_ONE,
        choice
      },
      reason,
      mentions
    }

    Position(opts, (err, position) => {
      if (err) return cb(err)
      if (!isPosition.chooseOne(position)) return cb(isPosition.chooseOne.errors)

      cb(null, position)
    })
  }
}
