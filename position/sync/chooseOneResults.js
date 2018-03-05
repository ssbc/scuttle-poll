var isPosition = require('./isPosition')()

module.exports = function (positions) {
  return positions.reduce(function (results, position) {
    if (!isPosition(position)) {
      results.errors.invalidPolls.push(position)
      return results
    }
    var { choice } = position.positionDetails
    var currentScore = results[choice]
    results[choice] = currentScore ? currentScore + 1 : 1

    return results
  }, {errors: {invalidPolls: []}})
}
