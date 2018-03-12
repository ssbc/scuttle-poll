const test = require('tape')
const pull = require('pull-stream')
const pullAsync = require('pull-async')
const ChooseOne = require('../../../position/async/chooseOne')()
const isPosition = require('../../../isPosition')

test('Position - ChooseOne', function (t) {
  pull(
    pullAsync(cb => {
      ChooseOne({
        poll: '%t+PhrNxxXkw/jMo6mnwUWfFjJapoPWxzsQoe0Np+nYw=.sha256'
      }, cb)
    }),
    pull.drain((missingChoice) => {
      t.false(isPosition(missingChoice), 'missing a choice')
    })
  )

  pull(
    pullAsync(cb => {
      ChooseOne({
        choice: 0
      }, cb)
    }),
    pull.drain((missingPoll) => {
      t.false(isPosition(missingPoll), 'missing a poll')
    })
  )

  pull(
    pullAsync(cb => {
      ChooseOne({
        poll: 'dog?',
        choice: 0
      }, cb)
    }),
    pull.drain((missingPoll) => {
      t.false(isPosition(missingPoll), 'does not reference a poll')
    })
  )

  pull(
    pullAsync(cb => {
      ChooseOne({
        poll: '%t+PhrNxxXkw/jMo6mnwUWfFjJapoPWxzsQoe0Np+nYw=.sha256',
        choice: 0
      }, cb)
    }),
    pull.drain((poll) => {
      t.true(isPosition(poll), 'simple')
    })
  )

  pull(
    pullAsync(cb => {
      ChooseOne({
        poll: '%t+PhrNxxXkw/jMo6mnwUWfFjJapoPWxzsQoe0Np+nYw=.sha256',
        choice: 0
      }, cb)
    }),
    pull.map((validPosition) => {
      return {
        key: '%somekey',
        value: {
          content: validPosition
        }
      }
    }),
    pull.drain((poll) => {
      t.true(isPosition(poll), 'simple (full msg)')
      t.end()
    })
  )

  // NOTE - we might want an isChooseOnePosition in future
  // t.true(isChooseOnePosition(fullPositionMsg), 'simple (full msg)')
})
