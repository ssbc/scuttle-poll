// verbose export of public methods
const {isPoll, isChooseOnePoll, isPosition} = require('ssb-poll-schema')

module.exports = {
  poll: {
    async: {
      publishChooseOne: require('./poll/async/publishChooseOne'),
      get: require('./poll/async/get')
    },
    sync: {
      isPoll: () => isPoll,
      isChooseOnePoll: () => isChooseOnePoll
      // Poll: // this is not exported - doesn't follow the inject pattern atm
    }
  },
  position: {
    async: {
      buildChooseOne: require('./position/async/buildChooseOne'),
      publishChooseOne: require('./position/async/publishChooseOne'),
      buildPosition: require('./position/async/buildPosition'),
      publishPosition: require('./position/async/publishPosition')
    },
    sync: {
      isPosition: () => isPosition
    }
  }
}
