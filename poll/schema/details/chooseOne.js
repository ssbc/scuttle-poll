const { chooseOnePollType } = require('../../../types')
const typeStringPattern = `^${chooseOnePollType}$`

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

module.exports = schema
