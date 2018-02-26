const Validate = require('is-my-json-valid')
const { msgIdRegex, feedIdRegex, blobIdRegex } = require('ssb-ref')

const dotType = require('./poll_types/dot.js')
const proposalType = require('./poll_types/proposal.js')
const scoreType = require('./poll_types/score.js')
const { schema: chooseOneType } = require('./poll_types/chooseOne.js')


const schema = {
  $schema: 'http://json-schema.org/schema#',
  type: 'object',
  required: ['type', 'pollType'],
  properties: {
    version: {
      type: 'string',
      pattern: '^0.1.0$'
    },
    type: {
      type: 'string',
      pattern: '^poll$'
    },
    pollType: {
      oneOf: [
        { $ref: '#/definitions/pollTypes/dot'},
        { $ref: '#/definitions/pollTypes/proposal'},
        { $ref: '#/definitions/pollTypes/score'},
        { $ref: '#/definitions/pollTypes/chooseOne'},
        //{ $ref: '#/definitions/pollTypes/rsvp'},
        //{ $ref: '#/definitions/pollTypes/meeting'},
      ] 
    },
    text: { type: 'string' },
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
              { $ref: '#/definitions/mentions/feed' },
            ]
          }
        }
      ]
    }
  },
  definitions: {

    messageId: {
      type: 'string',
      pattern: msgIdRegex
    },
    feedId: {
      type: 'string',
      pattern: feedIdRegex
    },
    blobId: {
      type: 'string',
      pattern: blobIdRegex
    },
    pollTypes: {
      type: 'object',
      dot: dotType,
      proposal: proposalType,
      score: scoreType,
      chooseOne: chooseOneType
    },
    mentions: {
      message: {
        type: 'object',
        required: ['link'],
        properties: {
          link: { $ref: '#/definitions/messageId'}
        }
      },
      feed: {
        type: 'object',
        required: ['link', 'name'],
        properties: {
          link: { $ref: '#/definitions/feedId'},
          name: { type: 'string' }
        }
      },
      blob: {
        type: 'object',
        required: ['link', 'name'],
        properties: {
          link: { $ref: '#/definitions/blobId'},
          name: { type: 'string' }
        }
      }
    }
  },
}

const validate = Validate(schema, { verbose: true })

module.exports = {
  schema,
  validate
}
