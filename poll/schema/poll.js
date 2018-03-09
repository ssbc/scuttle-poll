const dotDetails = require('./details/dot.js')
const proposalDetails = require('./details/proposal.js')
const scoreDetails = require('./details/score.js')
const chooseOneDetails = require('./details/chooseOne.js')

const ssbSchemaDefintions = require('../../lib/ssbSchemaDefintions')

const schema = {
  $schema: 'http://json-schema.org/schema#',
  type: 'object',
  required: ['type', 'details', 'title', 'closesAt'],
  properties: {
    version: {
      type: 'string',
      pattern: '^0.1.0$'
    },
    type: {
      type: 'string',
      pattern: '^poll$'
    },
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
    title: { type: 'string' },
    closesAt: { type: 'string', format: 'date-time' },
    body: { type: 'string' },
    mentions: { $ref: '#/definitions/mentions/any' },
    recps: { $ref: '#/definitions/recps' }
  },
  definitions: Object.assign({}, ssbSchemaDefintions, {
    details: {
      type: 'object',
      dot: dotDetails,
      proposal: proposalDetails,
      score: scoreDetails,
      chooseOne: chooseOneDetails
    }
  })
}

module.exports = schema
