const Validate = require('is-my-json-valid')
const { msgIdRegex, feedIdRegex, blobIdRegex } = require('ssb-ref')
// what would a message look like?
//
// well for a chooseOne:
// {
//  pollId: msgId,
//  choice: 0, // index of the choice
//  reason: "I don't like doctorbs",
// }
// When do the various validations happen?
// - when we're counting votes. We need to check it's a valid position for the type of poll
// - when we try and create the vote?
//
// Can a schema always capture the types we need. Max stance score is 1 for a chooseOne.

const schema = {
  $schema: 'http://json-schema.org/schema#',
  type: 'object',
  required: ['root', 'branch'],
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
  definitions: {

    messageId: {
      type: 'string',
      pattern: msgIdRegex
    },
    rootId: {
      type: 'string',
      pattern: msgIdRegex
    },
    branchId: {
      oneOf: [
        {
          type: 'string',
          pattern: msgIdRegex
        },
        {
          type: 'array',
          items: {
            type: 'string',
            pattern: msgIdRegex
          }
        }
      ]
    },
    feedId: {
      type: 'string',
      pattern: feedIdRegex
    },
    blobId: {
      type: 'string',
      pattern: blobIdRegex
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
  }
}

const validate = Validate(schema, { verbose: true })

module.exports = {
  schema,
  validate
}
