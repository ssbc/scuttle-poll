const test = require('tape')
const pull = require('pull-stream')
const pullAsync = require('pull-async')

const isPositionChoiceError = require('../../../errors/sync/isPositionChoiceError')()
const isPositionLateError = require('../../../errors/sync/isPositionLateError')()
const isPositionTypeError = require('../../../errors/sync/isPositionTypeError')()

const PositionTypeError = require('../../../errors/sync/positionTypeError')
const PositionLateError = require('../../../errors/sync/positionLateError')
const PositionChoiceError = require('../../../errors/sync/positionChoiceError')

const ChooseOne = require('../../../position/async/chooseOne')()

test('positionTypeError', function (t) {
  pull(
    pullAsync(cb => {
      ChooseOne({
        poll: '%t+PhrNxxXkw/jMo6mnwUWfFjJapoPWxzsQoe0Np+nYw=.sha256',
        choice: 0
      }, cb)
    }),
    pull.drain(validPosition => {
      var invalidError = PositionTypeError({})
      t.false(isPositionTypeError(invalidError), 'catches invalid error')

      var validError = PositionTypeError({position: validPosition})
      t.true(isPositionTypeError(validError), 'validates valid error')
      t.end()
    })

  )
})

test('positionLateError', function (t) {
  pull(
    pullAsync(cb => {
      ChooseOne({
        poll: '%t+PhrNxxXkw/jMo6mnwUWfFjJapoPWxzsQoe0Np+nYw=.sha256',
        choice: 0
      }, cb)
    }),
    pull.drain(validPosition => {
      var invalidError = PositionLateError({})
      t.false(isPositionTypeError(invalidError), 'catches invalid error')

      var validError = PositionLateError({position: validPosition})
      t.true(isPositionLateError(validError), 'validates valid error')
      t.end()
    })
  )
})

test('positionChoiceError', function (t) {
  pull(
    pullAsync(cb => {
      ChooseOne({
        poll: '%t+PhrNxxXkw/jMo6mnwUWfFjJapoPWxzsQoe0Np+nYw=.sha256',
        choice: 0
      }, cb)
    }),
    pull.drain(validPosition => {
      var invalidError = PositionChoiceError({})
      t.false(isPositionChoiceError(invalidError), 'catches invalid error')

      var validError = PositionChoiceError({position: validPosition})
      t.true(isPositionChoiceError(validError), 'validates valid error')
      t.end()
    })
  )
})
