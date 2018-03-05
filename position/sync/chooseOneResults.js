var isArray = require('isarray')
var isPosition = require('../../isPosition')
var Position = require('../../position/sync/position')

module.exports = function (positions) {
  return positions.reduce(function (results, position) {
    if (!isPosition(position)) { //TODO: make this isChooseOne
      results.errors.invalidPositions.push(position)
      return results
    }
    var { choice } = Position(position).positionDetails

    if (!isArray(results[choice])) {
      results[choice] = []
    }
    results[choice].push(position.value.author)

    return results
  }, {errors: {invalidPositions: []}})
}
