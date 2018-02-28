const validator = require('is-my-json-valid')
const schema = require('../schema/poll')
const isPollContent = validator(schema, {verbose: true})

// server is not used here. Closure pattern is just for consistency of use with other functions.
module.exports = function (server) {
  return function isPoll (obj) {
    const result = isPollContent(getMsgContent(obj))

    // exposes error messages provided by is-my-json-valid
    isPoll.errors = isPollContent.errors

    return result
  }
}

function getMsgContent (obj) {
  if (obj.value && obj.value.content) return obj.value.content

  return obj
}
