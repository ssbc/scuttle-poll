const Poll = require('./buildPoll')
const { MEETING_TIME } = require('../../types')

function ChooseOne ({ choices, title, closesAt, body, channel, recps, mentions }) {
  return Poll({
    details: {
      choices,
      type: MEETING_TIME
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
