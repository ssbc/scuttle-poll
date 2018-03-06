const test = require('tape')
const ChooseOne = require('../../../position/sync/chooseOne')
const Position = require('../../../position/sync/position')
const chooseOneResults = require('../../../position/sync/chooseOneResults')

const pietId = '@Mq8D3YC6VdErKQzV3oi2oK5hHSoIwR0hUQr4M46wr/0=.ed25519'
const mixId = '@Mq8D3YC6VdErKQzV3oi2oK5hHSoIwR0hUQr4M46wr/1=.ed25519'
const mikeyId = '@Mq8D3YC6VdErKQzV3oi2oK5hHSoIwR0hUQr4M46wr/2=.ed25519'
const timmyId = '@Mq8D3YC6VdErKQzV3oi2oK5hHSoIwR0hUQr4M46wr/3=.ed25519'
const tommyId = '@Mq8D3YC6VdErKQzV3oi2oK5hHSoIwR0hUQr4M46wr/4=.ed25519'
const sallyId = '@Mq8D3YC6VdErKQzV3oi2oK5hHSoIwR0hUQr4M46wr/5=.ed25519'

const poll = '%t+PhrNxxXkw/jMo6mnwUWfFjJapoPWxzsQoe0Np+nYw=.sha256'

test('Position - ChooseOneResults', function (t) {
  const positions = [
    { value: { content: Position(ChooseOne({choice: 0, poll})), author: pietId } },
    { value: { content: Position(ChooseOne({choice: 0, poll})), author: mixId } },
    { value: { content: Position(ChooseOne({choice: 0, poll})), author: mikeyId } },
    { value: { content: Position(ChooseOne({choice: 1, poll})), author: timmyId } },
    { value: { content: Position(ChooseOne({choice: 1, poll})), author: tommyId } },
    { value: { content: Position(ChooseOne({choice: 2, poll})), author: sallyId } }
  ]

  const actual = chooseOneResults({positions})
  t.deepEqual(actual[0], [pietId, mixId, mikeyId], 'correct voters for choice 0')
  t.deepEqual(actual[1], [timmyId, tommyId], 'correct voters for choice 1')
  t.deepEqual(actual[2], [sallyId], 'correct voters for choice 2')
  t.end()
})

test.skip('Position - a position stated for an invalid choice index is not counted', function(t) {

  t.end()
})

test.skip('Position - a position stated for an invalid choice index is included in the errors object', function(t) {

  t.end()
})

test.skip('Position - A position stated after the closing time of the poll is not counted', function(t) {

  t.end()
})
