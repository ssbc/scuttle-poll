const test = require('tape')
const pull = require('pull-stream')
const pullAsync = require('pull-async')
const { isPollUpdate } = require('ssb-poll-schema')
const Server = require('../../../lib/testServer')

const server = Server()

const publishChooseOne = require('../../../poll/async/publishChooseOne')(server)

const UpdateClosingTime = require('../../../poll/async/buildUpdatedClosingTime')(server)

test.onFinish(() => server.close())

test('poll.async.buildUpdatedClosingTime', function (t) {
  t.plan(5)
  const initialClosingTime = new Date().toISOString()

  const pollOpts = {title: 'are you reading this', choices: ['yes', 'no'], closesAt: initialClosingTime}
  publishChooseOne(pollOpts, (err, poll) => {
    if (err) throw err

    pull(
      pullAsync(cb => {
        UpdateClosingTime({
          poll
        }, cb)
      }),
      pull.drain((missingChoice) => {
        t.false(isPollUpdate(missingChoice), 'missing a closing time')
      })
    )

    t.throws(() => {
      pull(
        pullAsync(cb => {
          UpdateClosingTime({
            closesAt: initialClosingTime
          }, cb)
        }),
        pull.drain((missingPoll) => {})
      )
    }, 'missing a poll')

    t.throws(() => {
      pull(
        pullAsync(cb => {
          UpdateClosingTime({
            poll: 'dog?',
            closesAt: initialClosingTime
          }, cb)
        }),
        pull.drain((missingPoll) => { })
      )
    }, 'does not reference a poll')

    pull(
      pullAsync(cb => {
        UpdateClosingTime({
          poll,
          closesAt: initialClosingTime
        }, cb)
      }),
      pull.drain((poll) => {
        t.true(isPollUpdate(poll), 'simple')
      })
    )

    pull(
      pullAsync(cb => {
        UpdateClosingTime({
          poll,
          closesAt: initialClosingTime
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
        t.true(isPollUpdate(poll), 'simple (full msg)')
      })
    )

  // NOTE - we might want an isChooseOnePosition in future
  // t.true(isChooseOnePosition(fullPositionMsg), 'simple (full msg)')
  })
})
