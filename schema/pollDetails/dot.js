var schema = {
  type: 'object',
  required: ['type', 'maxStanceScore', 'choices'],
  properties: {
    type: {
      type: 'string',
      pattern: '^dot$'
    },
    numDots: {
      type: 'integer',
      minimum: 1
    },
    choices: {
      type: 'array',
    }
  }
}


module.exports = schema;
