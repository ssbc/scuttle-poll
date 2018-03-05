const test = require('tape')
const isPosition = require('../../../isPosition')

// this is for testing the attributes that are required for all polls
test('position - common requirements', function (t) {
  var missingDetails = {
    type: 'position',
    positionDetails: undefined
  }
  t.false(isPosition(missingDetails), 'needs details')
  t.true(isPosition.errors, 'failing validations have errors')

  t.end()
})
