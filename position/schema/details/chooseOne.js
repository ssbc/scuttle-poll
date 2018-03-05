const { chooseOnePositionType } = require('../../../types')
const typeStringPattern = `^${chooseOnePositionType}$`

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

module.exports = schema
