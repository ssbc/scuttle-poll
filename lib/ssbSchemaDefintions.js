const { msgIdRegex, feedIdRegex, blobIdRegex } = require('ssb-ref')

module.exports = {
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
  mentions: {
    message: {
      type: 'object',
      required: ['link'],
      properties: {
        link: { $ref: '#/definitions/messageId' }
      }
    },
    feed: {
      type: 'object',
      required: ['link', 'name'],
      properties: {
        link: { $ref: '#/definitions/feedId' },
        name: { type: 'string' }
      }
    },
    blob: {
      type: 'object',
      required: ['link', 'name'],
      properties: {
        link: { $ref: '#/definitions/blobId' },
        name: { type: 'string' }
      }
    },
    any: {
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
    }
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
}
