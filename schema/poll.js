const Validate = require('is-my-json-valid')
const { msgIdRegex, feedIdRegex, blobIdRegex } = require('ssb-ref')

const dotType = require('./pollDetails/dot.js')
const proposalType = require('./pollDetails/proposal.js')
const scoreType = require('./pollDetails/score.js')
const { schema: chooseOneType } = require('./pollDetails/chooseOne.js')

const schema = {
  $schema: 'http://json-schema.org/schema#',
  type: 'object',
  required: ['type', 'pollDetails'],
  properties: {
    version: {
      type: 'string',
      pattern: '^0.1.0$'
    },
    type: {
      type: 'string',
      pattern: '^poll$'
    },
    pollDetails: {
      oneOf: [
        { $ref: '#/definitions/pollDetails/dot'},
        { $ref: '#/definitions/pollDetails/proposal'},
        { $ref: '#/definitions/pollDetails/score'},
        { $ref: '#/definitions/pollDetails/chooseOne'},
        //{ $ref: '#/definitions/pollDetails/rsvp'},
        //{ $ref: '#/definitions/pollDetails/meeting'},
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
    pollDetails: {
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
