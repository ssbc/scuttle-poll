var Server = require('scuttle-testbot')
var pull = require('pull-stream')

var ChooseOnePoll = require('../../../poll/sync/chooseOne')
var ChooseOnePosition = require('../../../position/sync/chooseOne')
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

piet.publish(pollContent, (err, poll) => {
  if (err) throw err

  pull(
    pull.values([
      { author: katie, position: ChooseOnePosition({ poll: poll.key, choice: 1, reason: 'they are sick!' }) },
      { author: piet, position: ChooseOnePosition({ poll: poll.key, choice: 2, reason: 'scuttles 4life' }) }
    ]),
    pull.asyncMap((t, cb) => t.author.publish(t.position, cb)),
    pull.drain(
      m => console.log(m.value.content.type),
      onDone
    )
  )

  function onDone () {
    console.log('DONE, getting poll')
    getPoll(server)(poll.key, (err, data) => {
      if (err) throw err

      print(data)
      server.close()
    })
  }
})

function print (obj) {
  console.log(JSON.stringify(obj, null, 2))
}

function nDaysTime (n) {
  var d = new Date()
  return d.setDate(d.getDate() + n)
  // returns integer!
}
