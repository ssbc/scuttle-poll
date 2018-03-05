const validator = require('is-my-json-valid')
const schema = require('../schema/position')
const isPositionContent = validator(schema, {verbose: true})
const getMsgContent = require('../../lib/getMsgContent')

// server is not used here. Closure pattern is just for consistency of use with other functions.
module.exports = function (server) {
  return function isPosition (obj) {
    const result = isPositionContent(getMsgContent(obj))

    // exposes error messages provided by is-my-json-valid
    isPosition.errors = isPositionContent.errors

    return result
  }
}
