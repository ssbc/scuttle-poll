const test = require('tape')
const ChooseOne = require('../../../poll/sync/chooseOne')
const isPoll = require('../../../isPoll')

// this is for testing the attributes that are required for all polls

test('Poll - common requirements', function (t) {
  var missingTitle = ChooseOne({
    choices: [1, 2, 'three'],
    closesAt: Date.now()
  })
  t.false(isPoll(missingTitle), 'needs title')

  var missingClosesAt = ChooseOne({
    choices: [1, 2, 'three'],
    title: 'how many food'
  })
  t.false(isPoll(missingClosesAt), 'needs closes at')

  var missingDetails = {
    type: 'poll',
    pollDetails: undefined,
    title: 'how many food',
    closesAt: Date.now()
  }
  t.false(isPoll(missingDetails), 'needs details')
  t.true(isPoll.errors, 'failing validations have errors')

  t.end()
})
