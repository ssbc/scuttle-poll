const Postion = require('./position')
const { chooseOneType } = require('../../types')

function ChooseOne ({ choices, title, closesAt, body, channel, recps, mentions }) {
  return Postion({
    positionDetails: {
      choices,
      type: chooseOneType
    },
    title,
    closesAt,
    body,
    channel,
    recps,
    mentions
  })
}

module.exports = ChooseOne
