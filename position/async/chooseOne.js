const Position = require('./position')
const { CHOOSE_ONE } = require('../../types')

function ChooseOne ({ poll, choice, reason, channel, mentions }, cb) {
  Position({
    poll,
    details: {
      type: CHOOSE_ONE,
      choice
    },
    reason,
    channel,
    mentions
  }, cb)
}

module.exports = ChooseOne
