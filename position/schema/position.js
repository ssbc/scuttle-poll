const Validate = require('is-my-json-valid')
const chooseOneDetails = require('./details/chooseOne')

const ssbSchemaDefintions = require('../../lib/ssbSchemaDefintions')

const schema = {
  $schema: 'http://json-schema.org/schema#',
  type: 'object',
  required: ['type', 'positionDetails'],
  properties: {
    version: {
      type: 'string',
      pattern: '^0.1.0$'
    },
    type: {
      type: 'string',
      pattern: '^position$'
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
    mentions: {
      oneOf: [
        { type: 'null' },
        {
          type: 'array',
          items: {
            oneOf: [
              { $ref: '#/definitions/mentions/message' },
              { $ref: '#/definitions/mentions/feed' },
              { $ref: '#/definitions/mentions/blob' }
            ]
          }
        }
      ]
    },
    recps: {
      oneOf: [
        { type: 'null' },
        {
          type: 'array',
          items: {
            oneOf: [
              { $ref: '#/definitions/feedId' },
              { $ref: '#/definitions/mentions/feed' }
            ]
          }
        }
      ]
    }
  },
  definitions: Object.assign({},
    ssbSchemaDefintions,
    {
      positionDetails: {
        type: 'object',
        chooseOne: chooseOneDetails
      }
    }
  )
}

module.exports = schema
