const raw = require('./methods')
const PLUGIN_DEPS = ['backlinks']

const niceMappings = {
  pubishChooseOne: raw.poll.async.publishChooseOne
}
// by following this pattern you can write your own API

module.exports = function (server, opts) {
  const methods = Object.assign({}, raw, niceMappings)

  return require('scuttle-inject')(server, methods, PLUGIN_DEPS)
}
