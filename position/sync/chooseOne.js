const Position = require('./position')
const { CHOOSE_ONE } = require('../../types')

function ChooseOne ({ poll, choice, reason, channel, mentions }) {
  return Position({
    poll,
    positionDetails: {
      type: CHOOSE_ONE,
      choice
    },
    reason,
    channel,
    mentions
  })
}

module.exports = ChooseOne
