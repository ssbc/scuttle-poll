const test = require('tape')
const pull = require('pull-stream')
const pullAsync = require('pull-async')
const Server = require('../../../lib/testServer')

const isPositionChoiceError = require('../../../errors/sync/isPositionChoiceError')()
const isPositionLateError = require('../../../errors/sync/isPositionLateError')()
const isPositionTypeError = require('../../../errors/sync/isPositionTypeError')()

const PositionTypeError = require('../../../errors/sync/positionTypeError')
const PositionLateError = require('../../../errors/sync/positionLateError')
const PositionChoiceError = require('../../../errors/sync/positionChoiceError')

const pollOpts = {
  title: 'want to join my coop?',
  choices: [
    'yeah',
    'nah'
  ],
  closesAt: new Date().toISOString()
}

test('positionTypeError', function (t) {
  var server = Server()
  const scuttlePoll = require('../../../index')(server)
  pull(
    pullAsync(cb => scuttlePoll.poll.async.chooseOne(pollOpts, cb)),
    pull.asyncMap((poll, cb) => {
      scuttlePoll.position.async.chooseOne({
        poll: poll.key,
        choice: 0
      }, cb)
    }),
    pull.drain(validPosition => {
      var invalidError = PositionTypeError({})
      t.false(isPositionTypeError(invalidError), 'catches invalid error')

      var validError = PositionTypeError({position: validPosition})
      t.true(isPositionTypeError(validError), 'validates valid error')
      server.close()
      t.end()
    })
  )
})


test('positionLateError', function (t) {
  var server = Server()
  const scuttlePoll = require('../../../index')(server)
  pull(
    pullAsync(cb => scuttlePoll.poll.async.chooseOne(pollOpts, cb)),
    pull.asyncMap((poll, cb) => {
      scuttlePoll.position.async.chooseOne({
        poll: poll.key,
        choice: 0
      }, cb)
    }),
    pull.drain(validPosition => {
      var invalidError = PositionLateError({})
      t.false(isPositionTypeError(invalidError), 'catches invalid error')

      var validError = PositionLateError({position: validPosition})
      t.true(isPositionLateError(validError), 'validates valid error')
      server.close()
      t.end()
    })
  )
})

test('positionChoiceError', function (t) {
  var server = Server()
  const scuttlePoll = require('../../../index')(server)
  pull(
    pullAsync(cb => scuttlePoll.poll.async.chooseOne(pollOpts, cb)),
    pull.asyncMap((poll, cb) => {
      scuttlePoll.position.async.chooseOne({
        poll: poll.key,
        choice: 0
      }, cb)
    }),
    pull.drain(validPosition => {
      var invalidError = PositionChoiceError({})
      t.false(isPositionChoiceError(invalidError), 'catches invalid error')

      var validError = PositionChoiceError({position: validPosition})
      t.true(isPositionChoiceError(validError), 'validates valid error')
      server.close()
      t.end()
    })
  )
})

