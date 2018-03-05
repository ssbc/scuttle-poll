const test = require('tape')
const ChooseOne = require('../../../position/sync/chooseOne')
const isPosition = require('../../../isPosition')

test('Position - ChooseOne', function (t) {
  var missingChoice = ChooseOne({
    poll: '%t+PhrNxxXkw/jMo6mnwUWfFjJapoPWxzsQoe0Np+nYw=.sha256'
  })
  t.false(isPosition(missingChoice), 'missing a choice')

  var missingPoll = ChooseOne({
    choice: 0
  })
  t.false(isPosition(missingPoll), 'missing a poll')

  var brokenPoll = ChooseOne({
    poll: 'dog?',
    choice: 0
  })
  t.false(isPosition(missingPoll), 'does not reference a poll')

  var validPosition = ChooseOne({
    poll: '%t+PhrNxxXkw/jMo6mnwUWfFjJapoPWxzsQoe0Np+nYw=.sha256',
    choice: 0
  })
  t.true(isPosition(validPosition), 'simple')
  if (isPosition.errors) console.log(isPosition.errors)

  var fullPositionMsg = {
    key: '%somekey',
    value: {
      content: validPosition
    }
  }
  t.true(isPosition(fullPositionMsg), 'simple (full msg)')
  // NOTE - we might want an isChooseOnePosition in future
  // t.true(isChooseOnePosition(fullPositionMsg), 'simple (full msg)')

  t.end()
})
