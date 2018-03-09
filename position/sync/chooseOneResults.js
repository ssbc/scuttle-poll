var getMsgContent = require('../../lib/getMsgContent')
var ChooseOne = require('../../poll/sync/chooseOne')
const PositionChoiceError = require('../../errors/sync/positionChoiceError')
const PositionLateError = require('../../errors/sync/positionLateError')

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
  var results = getMsgContent(poll)
    .details
    .choices
    .map(choice => {
      return {
        choice,
        voters: {}
      }
    })

  return positions.reduce(function (acc, position) {
    const { author, content } = position.value
    const { choice } = content.details

    if (isInvalidChoice({position, poll})) {
      acc.errors.push(PositionChoiceError({position}))
      return acc
    }

    if (isPositionLate({position, poll})) {
      acc.errors.push(PositionLateError({position}))
      return acc
    }

    acc.results[choice].voters[author] = position

    return acc
  }, {errors: [], results})
}

function isInvalidChoice ({position, poll}) {
  const { choice } = position.value.content.details
  return choice >= poll.value.content.details.choices.length
}

function isPositionLate ({position, poll}) {
  return position.value.timestamp > poll.value.content.closesAt
}
