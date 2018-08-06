// verbose export of public methods
const {isPoll, isChooseOnePoll, isPosition, isChooseOnePosition} = require('ssb-poll-schema')

module.exports = {
  poll: {
    async: {
      get: require('./poll/async/get'),
      publishChooseOne: require('./poll/async/publishChooseOne'),
      publishUpdatedClosingTime: require('./poll/async/publishUpdatedClosingTime')
    },
    // NOTE - we think this is a bad idea, planning to deprecate
    // obs: {
    //   get: require('./poll/obs/get')
    // },
    sync: {
      isPoll: () => isPoll,
      isChooseOnePoll: () => isChooseOnePoll
      // Poll: // this is not exported - doesn't follow the inject pattern atm
    },
    pull: {
      closed: require('./poll/pull/closed'),
      open: require('./poll/pull/open'),
      all: require('./poll/pull/all'),
      mine: require('./poll/pull/mine')
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
      isChooseOnePosition: () => isChooseOnePosition
    }
  }
}
