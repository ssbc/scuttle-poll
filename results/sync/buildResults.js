const getContent = require('ssb-msg-content')
const { isChooseOnePoll, isPosition } = require('ssb-poll-schema')
const PositionChoiceError = require('../../errors/sync/positionChoiceError')
const PositionLateError = require('../../errors/sync/positionLateError')
const PositionTypeError = require('../../errors/sync/positionTypeError')

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

// TODO find a better home for this (it is not strongly in poll nor position domain)
module.exports = function ({positions, poll}) {
  if (isChooseOnePoll(poll)) {
    return chooseOneResults({positions, poll})
  }
}

function chooseOneResults ({positions, poll}) {
  var results = getContent(poll)
    .details
    .choices
    .map(choice => {
      return {
        choice,
        voters: {}
      }
    })

  return positions.reduce(function (acc, position) {
    const { author } = position.value
    const { choice } = getContent(position).details

    if (isInvalidType({position, poll})) {
      console.log('got an aninvalid position type')
      acc.errors.push(PositionTypeError({position}))
      return acc
    }

    if (isInvalidChoice({position, poll})) {
      acc.errors.push(PositionChoiceError({position}))
      return acc
    }

    if (isPositionLate({position, poll})) {
      acc.errors.push(PositionLateError({position}))
      return acc
    }

    deleteExistingVotesByAuthor({results: acc.results, author})
    acc.results[choice].voters[author] = position

    return acc
  }, {errors: [], results})
}

// !!! assumes these are already sorted by time.
// modifies results passed in
function deleteExistingVotesByAuthor ({author, results}) {
  results.forEach(result => {
    if (result.voters[author]) {
      delete result.voters[author]
    }
  })
}

function isInvalidType ({position, poll}) {
  // TODO:this is super fragile. We should be using a parsed or decorated poll
  const pollType = poll.value.content.details.type
  return !isPosition[pollType](position)
}

function isInvalidChoice ({position, poll}) {
  const { choice } = position.value.content.details
  // TODO:this is super fragile. We should be using a parsed or decorated poll
  return choice >= poll.value.content.details.choices.length
}

function isPositionLate ({position, poll}) {
  // TODO:this is super fragile. We should be using a parsed or decorated poll
  return position.value.timestamp > poll.value.content.closesAt
}
