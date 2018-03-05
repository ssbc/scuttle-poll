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
  t.deepEqual(actual, {0: 3, 1: 2, 2: 1})
  t.end()
})
