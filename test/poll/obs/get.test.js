const test = require('tape')
const Server = require('../../../lib/testServer')
const pull = require('pull-stream')

const ChooseOnePoll = require('../../../poll/sync/buildChooseOne')
const ChooseOnePosition = require('../../../position/async/buildChooseOne')
const UpdatedClosingTime = require('../../../poll/async/buildUpdatedClosingTime')
const getPoll = require('../../../poll/obs/get')

const server = Server()

const katie = server.createFeed()
const piet = server.createFeed()

const pollContent = ChooseOnePoll({
  title: "what's our mascott team?",
  choices: ['prairie dog', 'kea', 'hermit crab'],
  closesAt: nDaysTime(2)
})

const agesAway = nDaysTime(100)
const soSoon = nDaysTime(1)

test('poll.obs.get', t => {
  t.plan(12)
  piet.publish(pollContent, (err, poll) => {
    t.error(err)
    const pollDoc = getPoll(server)(poll.key)

    // TODO: test myPosition and errors

    pollDoc.sync(function (sync) {
      t.ok(sync, 'sync gets set')
    })
    pollDoc.poll(function (decoratedPoll) {
      t.equal(decoratedPoll.key, poll.key, 'has key')
      t.deepEqual(decoratedPoll.value, poll.value, 'has value')
      t.equal(decoratedPoll.author, poll.value.author, 'has author')
      t.equal(decoratedPoll.title, poll.value.content.title, 'has title')
    })

    pollDoc.positions(function (positions) {
      if (positions.length === 2) {
        t.ok(true, 'got 2 positions')
        t.deepEqual(positions[0].value.content.branch, [poll.key], 'first published position has poll as branch')
        t.deepEqual(positions[1].value.content.branch, [positions[0].key], 'second published branch has first position as branch')
        t.equal(positions[0].choice, pollContent.details.choices[1], 'choice is the value from the poll, not the index.')
      }
    })
    pollDoc.closesAt(function (closesAt) {
      if (closesAt === agesAway) {
        t.ok(true, 'closesAt is eventually set to agesAway')
      }
    })

    pollDoc.results(function (results) {
      if (results[1].voters[katie.id] && results[2].voters[piet.id]) {
        t.ok(true, 'results eventually are correct')
      }
    })

    pull(
      pull.values([
        { author: katie, opts: { poll, choice: 1, reason: 'they are sick!' } },
        { author: piet, opts: { poll, choice: 2, reason: 'scuttles 4life' } }
      ]),
      pull.asyncMap((t, cb) => {
        // NOTE: piet.get does not exist, so have to build using the master server
        ChooseOnePosition(server)(t.opts, (err, position) => {
          if (err) return cb(err)
          t.position = position
          cb(null, t)
        })
      }),
      pull.asyncMap((t, cb) => t.author.publish(t.position, cb)),
      pull.asyncMap((m, cb) => UpdatedClosingTime(server)({poll, closesAt: soSoon}, cb)),
      pull.asyncMap((m, cb) => UpdatedClosingTime(server)({poll, closesAt: agesAway}, cb)),
      pull.asyncMap((t, cb) => piet.publish(t, cb)),
      pull.drain(
        m => {}, // console.log(m.value.content.type),
        onDone
      )
    )

    function onDone () {
      server.close()
    }
  })
})

function nDaysTime (n) {
  const d = new Date()
  d.setDate(d.getDate() + n)

  return d.toISOString()
}
