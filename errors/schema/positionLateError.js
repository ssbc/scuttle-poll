const errorSchema = require('./error')
const cloneDeep = require('lodash.clonedeep')

const schema = cloneDeep(errorSchema)

// collapse the details down to be ONLY late error
schema.properties.type = { $ref: '#/definitions/errorTypes/errorLate' }

module.exports = schema
