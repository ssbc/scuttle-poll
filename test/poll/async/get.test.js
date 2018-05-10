const test = require('tape')
const Server = require('../../../lib/testServer')
const pull = require('pull-stream')

const ChooseOnePoll = require('../../../poll/sync/buildChooseOne')
const ChooseOnePosition = require('../../../position/async/buildChooseOne')
const UpdatedClosingTime = require('../../../poll/async/buildUpdatedClosingTime')
const getPoll = require('../../../poll/async/get')

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

test('pull.async.get', t => {
  piet.publish(pollContent, (err, poll) => {
    if (err) throw err

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
      getPoll(server)(poll.key, (err, data) => {
        if (err) throw err

        // print(data)
        t.equal(data.key, poll.key, 'has key')
        t.deepEqual(data.value, poll.value, 'has value')

        t.equal(data.author, poll.value.author, 'has author')
        t.equal(data.title, poll.value.content.title, 'has title')

        t.equal(data.positions.length, 2, 'has positions')

        t.equal(data.closesAt, agesAway, 'gets the most recently published updated closing time')

        const positions = data.positions
        t.deepEqual(positions[0].value.content.branch, [], 'first published position has no branch')
        t.deepEqual(positions[1].value.content.branch, [positions[0].key], 'second published branch has first position as branch')

        t.equal(positions[0].choice, pollContent.details.choices[1], 'choice is the value from the poll, not the index.')

        t.ok(data.results[1].voters[katie.id])
        t.ok(data.results[2].voters[piet.id])

        server.close()
        t.end()
      })
    }
  })
})

function print (obj) {
  console.log(JSON.stringify(obj, null, 2))
}

function nDaysTime (n) {
  const d = new Date()
  d.setDate(d.getDate() + n)

  return d.toISOString()
}
