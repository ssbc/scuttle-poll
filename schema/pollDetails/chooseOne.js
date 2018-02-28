const Validate = require('is-my-json-valid')

const typeString = 'chooseOne'
const typeStringPattern = `^${typeString}$`
const typeStringRegex = new RegExp(typeStringPattern)

function isValidTypeString (string) {
  return typeStringRegex.test(string)
}

function create ({choices}) {
  return {
    choices,
    type: typeString
  }
}

var schema = {
  type: 'object',
  required: ['type', 'choices'],
  properties: {
    type: {
      type: 'string',
      pattern: typeStringPattern
    },
    choices: {
      type: 'array'
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
