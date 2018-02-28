var test = require('tape')
var {poll, isPoll, response} = require('../..')

test('test', function (t) {
  t.true(true)
  t.end()
})

test('create and validate an invalid chooseOne poll', function (t) {
  var pollOptions = {type: 'chooseOne'}
  var myPoll = poll({text: 'how many food', mentions: null, recps: null, channel: null, pollOptions})
  t.false(isPoll(myPoll))
  t.end()
})
