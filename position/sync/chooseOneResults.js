var isPosition = require('./isPosition')

module.exports = function (positions) {
  positions.reduce(function (results, position) {
    if (!isPosition(position)) {
      return results
    }
    var { choice } = position
    var currentScore = results[choice]
    results[choice] = currentScore ? currentScore + 1 : 1

    return results
  }, {})
}
