const test = require('tape')
const ChooseOne = require('../../../position/sync/chooseOne')
const isPosition = require('../../../isPosition')

// this is for testing the attributes that are required for all polls
test('position - common requirements', function (t) {
  var missingTitle = ChooseOne({
    choices: [1, 2, 'three'],
    closesAt: Date.now()
  })
  t.false(isPosition(missingTitle), 'needs title')

  var missingClosesAt = ChooseOne({
    choices: [1, 2, 'three'],
    title: 'how many food'
  })
  t.false(isPosition(missingClosesAt), 'needs closes at')

  var missingDetails = {
    type: 'poll',
    pollDetails: undefined,
    title: 'how many food',
    closesAt: Date.now()
  }
  t.false(isPosition(missingDetails), 'needs details')
  t.true(isPosition.errors, 'failing validations have errors')

  t.end()
})
