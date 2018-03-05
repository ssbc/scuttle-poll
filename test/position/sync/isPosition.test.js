const test = require('tape')
const isPosition = require('../../../isPosition')

// this is for testing the attributes that are required for all polls
test('position - common requirements', function (t) {
  var missingDetails = {
    type: 'position',
    poll: '%t+PhrNxxXkw/jMo6mnwUWfFjJapoPWxzsQoe0Np+nYw=.sha256',
    positionDetails: undefined
  }
  t.false(isPosition(missingDetails), 'needs details')
  t.true(isPosition.errors, 'failing validations have errors')

  var missingPoll = {
    type: 'position',
    positionDetails: {
      type: 'chooseOnePosition',
      choice: 0
    }
  }
  t.false(isPosition(missingPoll), 'needs poll')

  t.end()
})
