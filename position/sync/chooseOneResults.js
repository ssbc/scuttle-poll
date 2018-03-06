var isArray = require('isarray')
var Position = require('../../position/sync/position')

// Expects `poll` and `position` objects passed in to be of shape:
// {
//  value: {
//    content: {...},
//    timestamp: ...
//    author: ...
//  }
// }
//
// postions must be of the correct type ie: type checked by the caller.
module.exports = function ({positions, poll}) {
  return positions.reduce(function (results, position) {
    var { positionDetails: {choice} } = Position(position)

    if (choice >= poll.pollDetails.choices.length || position.value.timestamp > poll.closesAt) {
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
