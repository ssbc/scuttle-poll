const Validate = require('is-my-json-valid')

const typeString = 'chooseOne'
const typeStringPattern = `^${typeString}$`
const typeStringRegex = new RegExp(typeStringPattern)

function isValidTypeString (string) {
  return typeStringRegex.test(string)
}

function create ({choice, reason}) {
  return {
    choice,
    type: typeString,
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
      type: 'string'
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
