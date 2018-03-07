const isArray = require('isarray')
const {ERROR_POSITION_CHOICE, ERROR_POSITION_TYPE, ERROR_POSITION_LATE} = require('../../types')

// Expects `poll` and `position` objects passed in to be of shape:
// {
//   key,
//   value: {
//     content: {...},
//     timestamp: ...
//     author: ...
//   }
// }
//
// postions must be of the correct type ie: type checked by the caller.
module.exports = function chooseOneResults ({positions, poll}) {
  return positions.reduce(function (results, position) {
    const { author, content } = position.value
    const { choice } = content.positionDetails

    if (isInvalidChoice({position, poll})) {
      // TODO change this to push errors into poll.errors
      results.errors.push({type: ERROR_POSITION_CHOICE, position})
      return results
    }

    if (isPositionLate({position, poll})) {
      // TODO change this to push errors into poll.errors
      results.errors.push({type: ERROR_POSITION_LATE, position})
      return results
    }

    // TODO convert from Array to Object
    // {
    //   'kea': {
    //     @piet: 'because things'
    //   },
    //   'hermit crab': {
    //     @katie: 'scuttz..',
    //     @mix: 'what she said'
    //   } ]
    // }
    if (!isArray(results[choice])) {
      results[choice] = []
    }
    results[choice].push(author)

    return results
  }, {errors: []})
}

function isInvalidChoice ({position, poll}) {
  const { choice } = position.value.content.positionDetails
  return choice >= poll.value.content.pollDetails.choices.length
}

function isPositionLate ({position, poll}) {
  return position.value.timestamp > poll.value.content.closesAt
}
