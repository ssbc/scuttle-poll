const Validate = require('is-my-json-valid')

const typeString = 'chooseOne'
const typeStringPattern =`^${typeString}$` 
const typeStringRegex = new RegExp(typeStringPattern) 

function isValidTypeString(string) {
  return typeStringRegex.test(string) 
}

function create({choices}) {
  return {
    choices,
    type: typeString,
    maxStanceScore: 1,
    maxChoiceScore: 1,
  } 
}

var schema = {
  type: 'object',
  required: ['type', 'maxStanceScore', 'choices'],
  properties: {
    type: {
      type: 'string',
      pattern: typeStringPattern
    },
    maxStanceScore: {
      type: 'integer',
      minimum: 1,
      maximum: 1,
    },
    maxChoiceScore: {
      type: 'integer',
      minimum: 1,
      minimum: 1,
    },
    choices: {
      type: 'array',
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
