const positionSchema = require('./position')
const cloneDeep = require('lodash.clonedeep')

const chooseOneSchema = cloneDeep(positionSchema)

// collapse the details down to be ONLY chooseOne
chooseOneSchema.properties.details = { $ref: '#/definitions/details/chooseOne' }

module.exports = chooseOneSchema
