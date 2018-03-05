const test = require('tape')
const ChooseOne = require('../../../position/sync/chooseOne')
const isPosition = require('../../../isPosition')

test('Position - ChooseOne', function (t) {
  var invalidPosition = ChooseOne({
  })
  t.false(isPosition(invalidPosition), 'missing a choice')

  var validPosition = ChooseOne({
    choice: 0
  })
  t.true(isPosition(validPosition), 'simple')

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
