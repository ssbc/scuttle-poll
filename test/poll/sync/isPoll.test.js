const test = require('tape')
const ChooseOne = require('../../../poll/sync/chooseOne')
const isPoll = require('../../../isPoll')

// this is for testing the attributes that are required for all polls

test('Poll - common requirements', function (t) {
  var missingTitle = ChooseOne({
    choices: [1, 2, 'three']
  })
  t.false(isPoll(missingTitle), 'needs title')

  var missingDetails = {
    type: 'poll',
    pollDetails: undefined,
    title: 'how many food'
  }
  t.false(isPoll(missingDetails), 'missing details')

  t.end()
})
