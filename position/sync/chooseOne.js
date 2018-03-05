const Postion = require('./position')
const { chooseOnePositionType } = require('../../types')

function ChooseOne ({ choice, body, channel, recps, mentions }) {
  console.log('choose one choice:', choice)
  return Postion({
    positionDetails: {
      choice,
      type: chooseOnePositionType
    },
    body,
    channel,
    recps,
    mentions
  })
}

module.exports = ChooseOne
