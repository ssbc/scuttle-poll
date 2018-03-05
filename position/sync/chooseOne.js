const Postion = require('./position')
const { chooseOnePositionType } = require('../../types')

function ChooseOne ({ poll, choice, reason, channel, recps, mentions }) {
  return Postion({
    poll,
    positionDetails: {
      type: chooseOnePositionType,
      choice
    },
    reason,
    channel,
    recps,
    mentions
  })
}

module.exports = ChooseOne
