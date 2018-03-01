const verboseMethods = {
  poll: {
    async: {
      // publishPoll: require('./async/publishPoll')
    },
    sync: {
      isPoll: require('./sync/isPoll')
      // Poll: // this is not exported - doesn't follow the inject pattern atm
    }
  },
  position: {

  }
}

const easyMethods = {
  isPoll: require('./sync/isPoll')
}

module.exports = function (server, opts) {
  const methods = Object.assign({}, verboseMethods, easyMethods)
  return require('./lib/inject')(server, methods)
}
