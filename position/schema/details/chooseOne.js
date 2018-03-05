const Validate = require('is-my-json-valid')

const { chooseOnePositionType } = require('../../../types')
const typeStringPattern = `^${chooseOnePositionType}$`
const typeStringRegex = new RegExp(typeStringPattern)

function isValidTypeString (string) {
  return typeStringRegex.test(string)
}

function create ({choice, reason}) {
  return {
    choice,
    type: chooseOnePositionType,
    reason
  }
}

var schema = {
  type: 'object',
  required: ['type', 'choice'],
  properties: {
    type: {
      type: 'string',
      pattern: typeStringPattern
    },
    choice: {
      type: 'integer',
      minimum: 0
    }
  }
}

const validate = Validate(schema, { verbose: true })

module.exports = {
  isValidTypeString,
  schema,
  validate,
  create
}
