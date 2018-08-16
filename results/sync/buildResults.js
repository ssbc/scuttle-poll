const getContent = require('ssb-msg-content')
const { isPoll, isPosition } = require('ssb-poll-schema')
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

  if (isPoll.chooseOne(poll)) {
    return chooseOneResults({positions, poll})
  }

  if (isPoll.meetingTime(poll)) {
    return meetingTimeResults({positions, poll})
  }

  return { results: [], errors: [] }
}

function meetingTimeResults ({positions, poll}) {
  const { choices } = getContent(poll).details

  var results = choices
    .map(choice => {
      return {
        choice: new Date(choice),
        voters: {}
      }
    })

  return positions.reduce((acc, position) => {
    const { author } = position.value
    const { choices } = getContent(position).details // << note multiple choices

    if (isInvalidType({position, poll})) {
      acc.errors.push(PositionTypeError({position}))
      return acc
    }

    if (isInvalidChoices({position, poll})) {
      acc.errors.push(PositionChoiceError({position}))
      return acc
    }

    if (isPositionLate({position, poll})) {
      acc.errors.push(PositionLateError({position}))
      return acc
    }

    deleteExistingVotesByAuthor({results: acc.results, author})
    choices.forEach(choice => {
      acc.results[choice].voters[author] = position
    })

    return acc
  }, {errors: [], results})

  function isInvalidChoices ({position, poll}) {
    const { choices } = position.value.content.details
    // TODO: this is fragile. We should be using a parsed or decorated poll
    return choices.some(choice => {
      return choice > poll.value.content.details.choices.length - 1
    })
  }
}

function chooseOneResults ({positions, poll}) {
  const { choices } = getContent(poll).details

  var results = choices
    .map(choice => {
      return {
        choice,
        voters: {}
      }
    })

  return positions.reduce((acc, position) => {
    const { author } = position.value
    const { choice } = getContent(position).details // << note singular choice

    if (isInvalidType({position, poll})) {
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


  function isInvalidChoice ({position, poll}) {
    const { choice } = position.value.content.details
    // TODO: this is fragile. We should be using a parsed or decorated poll
    return choice > poll.value.content.details.choices.length - 1
  }
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
  // TODO:this is fragile. We should be using a parsed or decorated poll
  const pollType = poll.value.content.details.type
  return !isPosition[pollType](position)
}

function isPositionLate ({position, poll}) {
  // TODO:this is fragile. We should be using a parsed or decorated poll
  return new Date(position.value.timestamp) > new Date(poll.value.content.closesAt)
}
