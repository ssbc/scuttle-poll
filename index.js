const {
  create: poll,
  schema: pollSchema,
  validate: isPoll
} = require('./poll')

const {
  create: stance,
  schema: stanceSchema,
  validate: isStance
} = require('./stance')

module.exports = {
  poll,
  pollSchema,
  isPoll,
  stance,
  stanceSchema,
  isStance
}
