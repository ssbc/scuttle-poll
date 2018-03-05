const Validate = require('is-my-json-valid')
const chooseOneDetails = require('./details/chooseOne')

const ssbSchemaDefintions = require('../../lib/ssbSchemaDefintions')

const schema = {
  $schema: 'http://json-schema.org/schema#',
  type: 'object',
  required: ['type', 'poll', 'positionDetails'],
  properties: {
    version: {
      type: 'string',
      pattern: '^0.1.0$'
    },
    type: {
      type: 'string',
      pattern: '^position$'
    },
    poll: {
      $ref: '#/definitions/messageId'
    },
    text: { type: 'string' },
    reason: { type: 'string' },
    positionDetails: {
      oneOf: [
        // { $ref: '#/definitions/positionDetails/dot'},
        // { $ref: '#/definitions/positionDetails/proposal'},
        // { $ref: '#/definitions/positionDetails/score'},
        { $ref: '#/definitions/positionDetails/chooseOne' }
        // { $ref: '#/definitions/positionDetails/rsvp'},
        // { $ref: '#/definitions/positionDetails/meeting'},
      ]
    },
    mentions: { $ref: '#/definitions/mentions/any' },
    recps: { $ref: '#/definitions/recps' }
  },
  definitions: Object.assign({}, ssbSchemaDefintions, {
    positionDetails: {
      type: 'object',
      chooseOne: chooseOneDetails
    }
  })
}

module.exports = schema
