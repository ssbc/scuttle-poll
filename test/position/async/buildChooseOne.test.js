const test = require('tape')
const pull = require('pull-stream')
const pullAsync = require('pull-async')
const {isPosition} = require('ssb-poll-schema')
const Server = require('../../../lib/testServer')

var server = Server()

const publishChooseOne = require('../../../poll/async/publishChooseOne')(server)
const ChooseOne = require('../../../position/async/buildChooseOne')(server)

test.onFinish(() => server.close())

test('position.async.buildChooseOne', function (t) {
  t.plan(5)

  const pollOpts = {title: 'are you reading this', choices: ['yes', 'no'], closesAt: new Date().toISOString()}
  publishChooseOne(pollOpts, (err, poll) => {
    if (err) throw err

    pull(
      pullAsync(cb => {
        ChooseOne({
          poll
        }, cb)
      }),
      pull.drain((missingChoice) => {
        t.false(isPosition(missingChoice), 'missing a choice')
      })
    )

    t.throws(() => {
      pull(
        pullAsync(cb => {
          ChooseOne({
            choice: 0
          }, cb)
        }),
        pull.drain((missingPoll) => {})
      )
    }, 'missing a poll')

    t.throws(() => {
      pull(
        pullAsync(cb => {
          ChooseOne({
            poll: 'dog?',
            choice: 0
          }, cb)
        }),
        pull.drain((missingPoll) => { })
      )
    }, 'does not reference a poll')

    pull(
      pullAsync(cb => {
        ChooseOne({
          poll,
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
          poll,
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
      })
    )

  // NOTE - we might want an isChooseOnePosition in future
  // t.true(isChooseOnePosition(fullPositionMsg), 'simple (full msg)')
  })
})
