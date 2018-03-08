const errorSchema = require('./positionError')
const cloneDeep = require('lodash.clonedeep')

const schema = cloneDeep(errorSchema)

// collapse the details down to be ONLY late error
schema.properties.type = { $ref: '#/definitions/errorTypes/errorLate' }

module.exports = schema
