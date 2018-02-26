const Validate = require('is-my-json-valid')
var schema = {
  type: 'object',
  required: ['type', 'maxStanceScore', 'choices'],
  properties: {
    type: {
      type: 'string',
      pattern: '^chooseOne'
    },
    maxStanceScore: {
      type: 'integer',
      minimum: 1,
      maximum: 1,
    },
    maxChoiceScore: {
      type: 'integer',
      minimum: 0,
      minimum: 1,
    },
    choices: {
      type: 'array',
    }
  }
}

const validate = Validate(schema, { verbose: true })

module.exports = {
  schema,
  validate
}
