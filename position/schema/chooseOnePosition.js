const positionSchema = require('./position')
const cloneDeep = require('lodash.clonedeep')

const chooseOneSchema = cloneDeep(positionSchema)

// collapse the details down to be ONLY chooseOne
chooseOneSchema.properties.pollDetails = { $ref: '#/definitions/pollDetails/chooseOne' }

module.exports = chooseOneSchema
