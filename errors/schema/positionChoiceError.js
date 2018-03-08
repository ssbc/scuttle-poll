const errorSchema = require('./positionError')
const cloneDeep = require('lodash.clonedeep')

const schema = cloneDeep(errorSchema)

// collapse the details down to be ONLY choice error
schema.properties.type = { $ref: '#/definitions/errorTypes/errorChoice' }

module.exports = schema
