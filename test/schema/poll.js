var test = require('tape')
var {poll, isPoll, response} = require('../..');

test('test', function(t) {
  t.true(true)
  t.end()
})

test('create and validate an invalid dot vote', function(t) {
  pollType = {}
  var myPoll = poll({text:"how many food", mentions: null, recps: null, channel: null, pollType})
  t.false(isPoll(myPoll))
  t.end()
})

test('create and validate a valid dot vote', function(t) {
  pollType = {type: 'dot', maxStanceScore: 10, choices: ['cats', 'dogs']}
  var myPoll = poll({text:"how many food", mentions: null, recps: null, channel: null, pollType})
  t.true(isPoll(myPoll))
  t.end()
})

test('create and validate an invalid chooseOne poll', function(t) {
  pollType = {type: 'chooseOne'}
  var myPoll = poll({text:"how many food", mentions: null, recps: null, channel: null, pollType})
  t.false(isPoll(myPoll))
  t.end()
})

test('create and validate a valid chooseOne poll', function(t) {
  pollType = {type: 'chooseOne', choices: ['cats', 'dogs', 'octopi']}
  var myPoll = poll({text:"how many food", mentions: null, recps: null, channel: null, pollType})
  t.true(isPoll(myPoll))
  t.end()
})
