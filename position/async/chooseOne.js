const createPosition = require('./position')
const { CHOOSE_ONE } = require('../../types')

module.exports = function buildChooseOne (server) {
  const Position = createPosition(server)
  return function ChooseOne ({ poll, choice, reason, mentions }, cb) {
    Position({
      poll,
      details: {
        type: CHOOSE_ONE,
        choice
      },
      reason,
      mentions
    }, cb)
  }
}
