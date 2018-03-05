// verbose export of public methods

module.exports = {
  poll: {
    async: {
      // publishPoll: require('./async/publishPoll')
    },
    sync: {
      isPoll: require('./poll/sync/isPoll')
      // Poll: // this is not exported - doesn't follow the inject pattern atm
    }
  },
  position: {
    sync: {
      isPosition: require('./position/sync/isPosition')
    }
  }
}
