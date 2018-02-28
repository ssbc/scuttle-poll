const schema = {
  type: 'object',
  required: ['type', 'maxChoiceScore', 'choices'],
  properties: {
    type: {
      type: 'string',
      pattern: '^score$'
    },
    maxChoiceScore: {
      type: 'integer',
      minimum: 2
    },
    choices: {
      type: 'array'
    }
  }
}

module.exports = schema
