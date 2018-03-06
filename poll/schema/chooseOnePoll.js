const pollSchema = require('./poll')
const cloneDeep = require('lodash.clonedeep')

const chooseOneSchema = cloneDeep(pollSchema)

// collapse the details down to be ONLY chooseOne
chooseOneSchema.properties.pollDetails = { $ref: '#/definitions/pollDetails/chooseOne' }

module.exports = chooseOneSchema
