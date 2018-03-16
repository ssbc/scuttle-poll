// verbose export of public methods
const {isPoll, isChooseOnePoll, isPosition} = require('ssb-poll-schema')

module.exports = {
  poll: {
    async: {
      chooseOne: require('./poll/async/chooseOne'),
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
      chooseOne: require('./position/async/chooseOne'),
      position: require('./position/async/position')
    },
    sync: {
      isPosition: () => isPosition
    }
  }
}
