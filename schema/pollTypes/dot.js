var schema = {
  type: 'object',
  required: ['type', 'maxStanceScore', 'choices'],
  properties: {
    type: {
      type: 'string',
      pattern: '^dot$'
    },
    maxStanceScore: {
      type: 'integer',
      minimum: 0
    },
    maxChoiceScore: {
      type: 'integer',
      minimum: 0
    },
    choices: {
      type: 'array',
    }
  }
}


module.exports = schema;
