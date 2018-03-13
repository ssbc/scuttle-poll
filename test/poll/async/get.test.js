var test = require('tape')
const Server = require('../../../lib/testServer')
var pull = require('pull-stream')

var ChooseOnePoll = require('../../../poll/sync/buildChooseOne')
var ChooseOnePosition = require('../../../position/async/buildChooseOne')
var getPoll = require('../../../poll/async/get')

var server = Server()

var katie = server.createFeed()
var piet = server.createFeed()

var pollContent = ChooseOnePoll({
  title: "what's our mascott team?",
  choices: ['prairie dog', 'kea', 'hermit crab'],
  closesAt: nDaysTime(2)
})

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

        var positions = data.positions
        // console.log(positions)
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
  var d = new Date()
  d.setDate(d.getDate() + n)

  return d.toISOString()
}
