const Poll = require('./buildPoll')
const { CHOOSE_ONE } = require('../../types')

function ChooseOne ({ choices, title, closesAt, body, channel, recps, mentions }) {
  return Poll({
    details: {
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
