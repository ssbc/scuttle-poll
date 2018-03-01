const inject = require('./lib/inject')

const methods = {
  sync: {
    isPoll: require('./sync/isPoll')
  }
}

module.exports = function (server) {
  return inject(server, methods)
}
