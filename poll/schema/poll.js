const dotDetails = require('./details/dot.js')
const proposalDetails = require('./details/proposal.js')
const scoreDetails = require('./details/score.js')
const chooseOneDetails = require('./details/chooseOne.js')

const ssbSchemaDefintions = require('../../lib/ssbSchemaDefintions')

const schema = {
  $schema: 'http://json-schema.org/schema#',
  type: 'object',
  required: ['type', 'pollDetails', 'title', 'closesAt'],
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
        // { $ref: '#/definitions/pollDetails/dot'},
        // { $ref: '#/definitions/pollDetails/proposal'},
        // { $ref: '#/definitions/pollDetails/score'},
        { $ref: '#/definitions/pollDetails/chooseOne' }
        // { $ref: '#/definitions/pollDetails/rsvp'},
        // { $ref: '#/definitions/pollDetails/meeting'},
      ]
    },
    title: { type: 'string' },
    closesAt: { type: 'integer' },
    body: { type: 'string' },
    mentions: { $ref: '#/definitions/mentions/any' },
    recps: { $ref: '#/definitions/recps' }
  },
  definitions: Object.assign({}, ssbSchemaDefintions, {
    pollDetails: {
      type: 'object',
      dot: dotDetails,
      proposal: proposalDetails,
      score: scoreDetails,
      chooseOne: chooseOneDetails
    }
  })
}

module.exports = schema
