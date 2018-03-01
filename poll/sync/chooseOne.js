const Poll = require('./poll')
const { chooseOneType } = require('../types')

function ChooseOne ({ choices, title, text, channel, recps, mentions }) {
  return Poll({
    pollDetails: {
      choices,
      type: chooseOneType
    },
    text,
    title,
    channel,
    recps,
    mentions
  })
}

module.exports = ChooseOne
