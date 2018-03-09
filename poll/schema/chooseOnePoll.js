const pollSchema = require('./poll')
const cloneDeep = require('lodash.clonedeep')

const chooseOneSchema = cloneDeep(pollSchema)

// collapse the details down to be ONLY chooseOne
chooseOneSchema.properties.details = { $ref: '#/definitions/details/chooseOne' }

module.exports = chooseOneSchema
