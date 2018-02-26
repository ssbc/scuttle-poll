var schema = {
  type: 'object',
  required: ['type', 'proposal'],
  properties: {
    type: {
      type: 'string',
      pattern: '^proposal$'
    },
    proposal: {
      type: 'string',
    }
  }
}

module.exports = schema;
