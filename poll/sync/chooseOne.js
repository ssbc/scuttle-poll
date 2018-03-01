const Poll = require('./poll')
const { chooseOneType } = require('../types')

function ChooseOne ({ choices, title, closesAt, body, channel, recps, mentions }) {
  return Poll({
    pollDetails: {
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
