const { each, map } = require('libnested')
const { onceTrue, watch, Value } = require('mutant')
const assert = require('assert')
// const Struct = require('../struct')

// auto-inject the ssb-server to all methods to reduce repitition
module.exports = function inject (server, methods, pluginDeps = []) {
  checkMethods(methods)

  switch (typeof server) {
    case 'object': // just a classic ssb server
      checkPlugins(server, pluginDeps)
      return map(methods, (fn, path) => fn(server))

    case 'function': // hopefully an observeable which will contain an ssb server
      return injectObsServer(server, methods)

    default:
      throw new Error('scuttle-blog expects an ssb server (or obs that contains one)')
  }
}

// TODO fix this plugins Deps thing D:
function injectObsServer (server, methods, pluginDeps = []) {
  onceTrue(server, server => checkPlugins(server, pluginDeps))

  return map(methods, (fn, path) => {
    if (path.includes('async')) {
      return function () {
        onceTrue(
          server,
          server => fn(server).apply(null, arguments)
        )
      }
    }

    // NOTE - both `obs` and `sync` methods will return observeables
    return function () {
      var result = Value({})
      // var result = Struct({}) // WARNING - this shouldn't be copied for other apps, only works with obs.get method here. Probably breaks sync.isBlog
      onceTrue(
        server,
        server => {
          var res = fn(server).apply(null, arguments)
          watch(res, res => result.set(res))
        }
      )
      return result
    }
  })
}

function checkMethods (methods) {
  const server = { backlinks: 'fake' }
  each(methods, (fn, path) => {
    assert(typeof fn === 'function', `${path.join('.')}: expect each method to be a function`)
    const injectedMethod = fn(server)
    assert(typeof injectedMethod === 'function', `${path.join('.')}: expect each method to be a closure which accepts a server and returns a function`)
  })
}

function checkPlugins (server, pluginDeps) {
  pluginDeps.forEach(p => {
    if (!server[p]) throw new Error(`scuttle-blog needs a scuttlebot server with the ${p} plugin installed`)
  })
}
