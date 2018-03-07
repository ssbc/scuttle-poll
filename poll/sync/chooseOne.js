const Poll = require('./poll')
const { CHOOSE_ONE } = require('../../types')

function ChooseOne ({ choices, title, closesAt, body, channel, recps, mentions }) {
  return Poll({
    pollDetails: {
      choices,
      type: CHOOSE_ONE
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
