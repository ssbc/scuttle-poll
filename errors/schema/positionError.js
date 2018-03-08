const { ERROR_POSITION_CHOICE, ERROR_POSITION_TYPE, ERROR_POSITION_LATE } = require('../../types')

var schema = {
  type: 'object',
  required: ['type', 'position', 'message'],
  properties: {
    type: {
      oneOf: [
        { $ref: '#/definitions/errorTypes/errorChoice' },
        { $ref: '#/definitions/errorTypes/errorTypes' },
        { $ref: '#/definitions/errorTypes/errorLate' }
      ]
    },
    position: {
      type: 'object'
    },
    message: {
      type: 'string'
    },
    definitions: {
      errorTypes: {
        errorChoice: {
          type: 'string',
          pattern: `^${ERROR_POSITION_CHOICE}$`
        },
        errorType: {
          type: 'string',
          pattern: `^${ERROR_POSITION_TYPE}$`
        },
        errorLate: {
          type: 'string',
          pattern: `^${ERROR_POSITION_LATE}$`
        }
      }
    }
  }
}

module.exports = schema
