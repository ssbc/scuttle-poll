const pollSchema = require('./poll')

const chooseOneSchema = Object.assign({}, pollSchema)

// collapse the details down to be ONLY chooseOne
chooseOneSchema.properties.pollDetails = { $ref: '#/definitions/pollDetails/chooseOne' }

module.exports = chooseOneSchema
