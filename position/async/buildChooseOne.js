const createPosition = require('./buildPosition')
const { CHOOSE_ONE } = require('../../types')

module.exports = function (server) {
  const Position = createPosition(server)
  return function ChooseOne ({ poll, choice, reason, channel, mentions }, cb) {
    Position({
      poll,
      details: {
        type: CHOOSE_ONE,
        choice
      },
      reason,
      channel,
      mentions
    }, cb)
  }
}
