const Poll = require('./poll')
const { chooseOnePollType } = require('../../types')

function ChooseOne ({ choices, title, closesAt, body, channel, recps, mentions }) {
  return Poll({
    pollDetails: {
      choices,
      type: chooseOnePollType
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
