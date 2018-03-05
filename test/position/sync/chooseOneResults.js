const test = require('tape')
const ChooseOne = require('../../../position/sync/chooseOne')
const chooseOneResults = require('../../../position/sync/chooseOneResults')

test('Position - ChooseOneResults', function (t) {
  const results = [
    ChooseOne({choice: 0}),
    ChooseOne({choice: 0}),
    ChooseOne({choice: 0}),
    ChooseOne({choice: 1}),
    ChooseOne({choice: 1}),
    ChooseOne({choice: 2})
  ]

  const actual = chooseOneResults(results)
  t.equal(actual[0], 3)
  t.equal(actual[1], 2)
  t.equal(actual[2], 1)
  t.end()
})

test('Position - ChooseOneResults includes invalid poll in errors on results', function (t) {
  const badPositon = {reckon: 'nah'} // invalid poll
  const results = [
    ChooseOne({choice: 0}),
    ChooseOne({choice: 0}),
    ChooseOne({choice: 0}),
    ChooseOne({choice: 1}),
    ChooseOne({choice: 1}),
    ChooseOne({choice: 2}),
    badPositon
  ]

  const actual = chooseOneResults(results)
  t.deepEqual(actual, {0: 3, 1: 2, 2: 1, errors: {invalidPolls: [badPositon]}})
  t.end()
})
