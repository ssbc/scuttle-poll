const { ERROR_POSITION_CHOICE, ERROR_POSITION_TYPE, ERROR_POSITION_LATE } = require('../../types')

var schema = {
  type: 'object',
  required: ['type', 'position', 'message'],
  properties: {
    type: {
      type: 'string',
      oneOf: [
        {
          type: 'string',
          pattern: `^${ERROR_POSITION_CHOICE}$`

        },
        {

        },
        {

        },
        ERROR_POSITION_CHOICE,
        ERROR_POSITION_TYPE,
        ERROR_POSITION_LATE
      ]
    },
    position: {
      type: 'object'
    },
    message: {
      type: 'string'
    },
    definitions: {
      errorTypePatterns: {

      }
    }
  }
}

module.exports = schema
