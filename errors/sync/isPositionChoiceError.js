const Validator = require('is-my-json-valid')
const schema = require('../schema/positionChoiceError')
const validator = Validator(schema, {verbose: true})

module.exports = function isError (obj) {
  const result = validator(obj)

  // exposes error messages provided by is-my-json-valid
  isError.errors = validator.errors

  return result
}
