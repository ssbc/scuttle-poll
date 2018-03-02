const test = require('tape')
const ChooseOne = require('../../../poll/sync/chooseOne')
const isPoll = require('../../../isPoll')

test('Position - ChooseOne', function (t) {
  var validPoll = ChooseOne({
    choices: [1, 2, 'three'],
    title: 'how many food',
    closesAt: Date.now()
  })
  t.true(isPoll(validPoll), 'simple')

  var fullPollMsg = {
    key: '%somekey',
    value: {
      content: validPoll
    }
  }
  t.true(isPoll(fullPollMsg), 'simple (full msg)')
  // NOTE - we might want an isChooseOnePoll in future
  // t.true(isChooseOnePoll(fullPollMsg), 'simple (full msg)')

  t.end()
})
