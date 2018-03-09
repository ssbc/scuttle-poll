const Validate = require('is-my-json-valid')
const chooseOneDetails = require('./details/chooseOne')

const ssbSchemaDefintions = require('../../lib/ssbSchemaDefintions')

const schema = {
  $schema: 'http://json-schema.org/schema#',
  type: 'object',
  required: ['type', 'root', 'details'],
  properties: {
    version: {
      type: 'string',
      pattern: '^0.1.0$'
    },
    type: {
      type: 'string',
      pattern: '^position$'
    },
    root: {
      $ref: '#/definitions/messageId'
    },
    text: { type: 'string' },
    reason: { type: 'string' },
    details: {
      oneOf: [
        // { $ref: '#/definitions/details/dot'},
        // { $ref: '#/definitions/details/proposal'},
        // { $ref: '#/definitions/details/score'},
        { $ref: '#/definitions/details/chooseOne' }
        // { $ref: '#/definitions/details/rsvp'},
        // { $ref: '#/definitions/details/meeting'},
      ]
    },
    mentions: { $ref: '#/definitions/mentions/any' },
    recps: { $ref: '#/definitions/recps' }
  },
  definitions: Object.assign({}, ssbSchemaDefintions, {
    details: {
      type: 'object',
      chooseOne: chooseOneDetails
    }
  })
}

module.exports = schema
