var Validate = require('is-my-json-valid')
const { msgIdRegex, feedIdRegex, blobIdRegex } = require('ssb-ref')

function create () {

}

const schema = {
}

const validate = Validate(schema, { verbose: true })

module.exports = {
  create,
  schema,
  validate
}
