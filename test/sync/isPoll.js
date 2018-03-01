var test = require('tape')

var isPoll = require('../../isPoll')
var poll = require('../sync/poll')

test('create and validate an invalid chooseOne poll', function (t) {
  var pollDetails = {type: 'chooseOne'}
  var myPoll = poll({text: 'how many food', mentions: null, recps: null, channel: null, pollDetails})
  t.false(isPoll(myPoll))
  t.end()
})

test('create and validate an invalid dot vote', function (t) {
  var pollDetails = {}
  var myPoll = poll({text:"how many food", mentions: null, recps: null, channel: null, pollDetails})
  t.false(isPoll(myPoll))
  t.end()
})

test('create and validate a valid dot vote', function(t) {
  var pollDetails = {type: 'dot', maxStanceScore: 10, choices: ['cats', 'dogs']}
  var myPoll = poll({text:"how many food", mentions: null, recps: null, channel: null, pollDetails})
  t.true(isPoll(myPoll))
  t.end()
})

test('create and validate an invalid chooseOne poll', function(t) {
  var pollDetails = {type: 'chooseOne'}
  var myPoll = poll({text:"how many food", mentions: null, recps: null, channel: null, pollDetails})
  t.false(isPoll(myPoll))
  t.end()
})

test('create and validate a valid chooseOne poll', function(t) {
  var pollDetails = {type: 'chooseOne', choices: ['cats', 'dogs', 'octopi']}
  var myPoll = poll({text:"how many food", mentions: null, recps: null, channel: null, pollDetails})
  t.true(isPoll(myPoll))
  t.end()
})
