var isArray = require('isarray')
var isPosition = require('../../isPosition')
var Position = require('../../position/sync/position')

module.exports = function ({positions, poll}) { //postions must be of the correct type ie checked by the caller.
  return positions.reduce(function (results, position) {
    var { choice } = Position(position).positionDetails

    if (choice >= poll.pollDetails.choices.length) {
      results.errors.invalidPositions.push(position)
      return results
    }

    if (!isArray(results[choice])) {
      results[choice] = []
    }
    results[choice].push(position.value.author)

    return results
  }, {errors: {invalidPositions: []}})
}
