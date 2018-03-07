const test = require('tape')

const isError = require('../../../errors/sync/isError')
const isPositionChoiceError = require('../../../errors/sync/isPositionChoiceError')()
const isPositionLateError = require('../../../errors/sync/isPositionLateError')()
const isPositionTypeError = require('../../../errors/sync/isPositionTypeError')()

const positionTypeError = require('../../../errors/sync/positionTypeError')
const positionLateError = require('../../../errors/sync/positionLateError')
const positionChoiceError = require('../../../errors/sync/positionChoiceError')

const ChooseOne = require('../../../position/sync/chooseOne')

test('positionTypeError', function (t) {
  var validPosition = ChooseOne({
    poll: '%t+PhrNxxXkw/jMo6mnwUWfFjJapoPWxzsQoe0Np+nYw=.sha256',
    choice: 0
  })
  var invalidError = positionTypeError({})
  t.false(isPositionTypeError(invalidError), 'catches invalid error')

  var validError = positionTypeError({position: validPosition})
  t.true(isPositionTypeError(validError), 'validates valid error')
  t.end()
})

test('positionLateError', function (t) {
  var validPosition = ChooseOne({
    poll: '%t+PhrNxxXkw/jMo6mnwUWfFjJapoPWxzsQoe0Np+nYw=.sha256',
    choice: 0
  })
  var invalidError = positionLateError({})
  t.false(isPositionTypeError(invalidError), 'catches invalid error')

  var validError = positionLateError({position: validPosition})
  t.true(isPositionLateError(validError), 'validates valid error')
  t.end()
})

test('positionChoiceError', function (t) {
  var validPosition = ChooseOne({
    poll: '%t+PhrNxxXkw/jMo6mnwUWfFjJapoPWxzsQoe0Np+nYw=.sha256',
    choice: 0
  })
  var invalidError = positionChoiceError({})
  t.false(isPositionChoiceError(invalidError), 'catches invalid error')

  var validError = positionChoiceError({position: validPosition})
  t.true(isPositionChoiceError(validError), 'validates valid error')
  t.end()
})
