// verbose export of public methods

module.exports = {
  poll: {
    async: {
      chooseOne: require('./poll/async/chooseOne'),
      get: require('./poll/async/get')
    },
    sync: {
      isPoll: require('./poll/sync/isPoll')
      // Poll: // this is not exported - doesn't follow the inject pattern atm
    }
  },
  position: {
    async: {
      chooseOne: require('./position/async/chooseOne'),
      position: require('./position/async/position')
    },
    sync: {
      isPosition: require('./position/sync/isPosition')
    }
  }
}
