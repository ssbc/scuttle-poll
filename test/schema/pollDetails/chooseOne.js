var test = require('tape')
var {create, validate} = require('../../../schema/pollDetails/chooseOne');

test('create and validate an invalid chooseOne poll', function(t) {
  var myPoll = create({choices:"how"})
  t.false(validate(myPoll))
  t.end()
})

test('create and validate a valid chooseOne poll', function(t) {
  var myPoll = create({choices:["how","many", "food"]})
  t.true(validate(myPoll))
  t.end()
})
