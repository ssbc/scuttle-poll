const Validator = require('is-my-json-valid')
const schema = require('../schema/positionLateError')
const validator = Validator(schema, {verbose: true})

// server is not used here. Closure pattern is just for consistency of use with other functions.
module.exports = function isPositionLateError (obj) {
  const result = validator(obj)

  // exposes error messages provided by is-my-json-valid
  isPositionLateError.errors = validator.errors

  return result
}
