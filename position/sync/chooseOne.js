const Postion = require('./position')
const { CHOOSE_ONE } = require('../../types')

function ChooseOne ({ poll, choice, reason, channel, recps, mentions }) {
  return Postion({
    poll,
    positionDetails: {
      type: CHOOSE_ONE,
      choice
    },
    reason,
    channel,
    recps,
    mentions
  })
}

module.exports = ChooseOne
