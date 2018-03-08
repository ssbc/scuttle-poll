var test = require('tape')
var Server = require('scuttle-testbot')
var pull = require('pull-stream')

var ChooseOnePoll = require('../../../poll/sync/chooseOne')
var ChooseOne = require('../../../position/sync/chooseOne')
var getPoll = require('../../../poll/async/get')

Server
  .use(require('ssb-backlinks'))

var server = Server({name: 'testBotName'})

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
        { author: katie, position: ChooseOne({ poll, choice: 1, reason: 'they are sick!' }) },
        { author: piet, position: ChooseOne({ poll, choice: 2, reason: 'scuttles 4life' }) }
      ]),
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

        t.deepEqual(data.results, {
          1: [katie.id], // TODO update this data structure
          2: [piet.id],
          errors: [] // TODO prune this later
        }, 'has results!')

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
  return d.setDate(d.getDate() + n)
  // returns integer!
}