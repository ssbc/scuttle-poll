const isArray = require('isarray')
const Position = require('../../position/sync/position')
const {ERROR_POSITION_CHOICE, ERROR_POSITION_TYPE, ERROR_POSITION_LATE} = require('../../types')

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
module.exports = function chooseOneResults ({positions, poll}) {
  return positions.reduce(function (results, position) {
    const { value: {author} } = position
    const { positionDetails: {choice} } = Position(position)

    if (isInvalidChoice({position, poll})) {
      results.errors.push({type: ERROR_POSITION_CHOICE, position})
      return results
    }

    if (isPositionLate({position, poll})) {
      results.errors.push({type: ERROR_POSITION_LATE, position})
      return results
    }

    if (!isArray(results[choice])) {
      results[choice] = []
    }
    results[choice].push(author)

    return results
  }, {errors: []})
}

function isInvalidChoice ({position, poll}) {
  const { positionDetails: {choice} } = Position(position)
  return choice >= poll.pollDetails.choices.length
}

function isPositionLate ({position, poll}) {
  return position.value.timestamp > poll.closesAt
}
