// verbose export of public methods
const { isPoll, isPosition } = require('ssb-poll-schema')

module.exports = {
  poll: {
    async: {
      get: require('./poll/async/get'),
      publishChooseOne: require('./poll/async/publishChooseOne'),
      publishMeetingTime: require('./poll/async/publishMeetingTime'),
      publishUpdatedClosingTime: require('./poll/async/publishUpdatedClosingTime'),
      publishResolution: require('./poll/async/publishResolution')
    },
    // DEPRECATED - we think this is a bad idea, see notes in file
    // obs: {
    //   get: require('./poll/obs/get')
    // },
    sync: {
      isPoll: () => isPoll
      // Poll: // this is not exported - doesn't follow the inject pattern atm
    },
    pull: {
      closed: require('./poll/pull/closed'),
      open: require('./poll/pull/open'),
      all: require('./poll/pull/all'),
      mine: require('./poll/pull/mine'),
      updates: require('./poll/pull/updates')
    }
  },
  position: {
    async: {
      // buildChooseOne: require('./position/async/buildChooseOne'),
      // buildMeetingTime: require('./position/async/buildMeetingTime'),
      // buildPosition: require('./position/async/buildPosition'),
      publishChooseOne: require('./position/async/publishChooseOne'),
      publishMeetingTime: require('./position/async/publishMeetingTime')
    },
    sync: {
      isPosition: () => isPosition
    }
  }
}
