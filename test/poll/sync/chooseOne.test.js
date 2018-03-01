const test = require('tape')
const ChooseOne = require('../../../poll/sync/chooseOne')
const isPoll = require('../../../isPoll')

test('ChooseOne', function (t) {
  var validPoll = ChooseOne({choices: [1, 2, 'three'], title: 'how many food'})
  t.ok(isPoll(validPoll), 'simple')

  var fullPollMsg = {
    key: '%somekey',
    value: {
      content: validPoll
    }
  }
  t.ok(isPoll(fullPollMsg), 'simple (full msg)')
  // NOTE - we might want an isChooseOnePoll in future
  // t.ok(isChooseOnePoll(fullPollMsg), 'simple (full msg)')

  var missingTitle = ChooseOne({choices: 'how'})
  t.notOk(isPoll(missingTitle), 'only one choice => invalid')
  t.ok(isPoll.errors, 'missing title => has errors')

  t.end()
})
