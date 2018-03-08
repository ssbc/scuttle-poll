const test = require('tape')
const ChooseOne = require('../../../position/sync/chooseOne')
const ChooseOnePoll = require('../../../poll/sync/chooseOne')
const chooseOneResults = require('../../../position/sync/chooseOneResults')
const {ERROR_POSITION_CHOICE, ERROR_POSITION_TYPE, ERROR_POSITION_LATE} = require('../../../types')

const pietId = '@Mq8D3YC6VdErKQzV3oi2oK5hHSoIwR0hUQr4M46wr/0=.ed25519'
const mixId = '@Mq8D3YC6VdErKQzV3oi2oK5hHSoIwR0hUQr4M46wr/1=.ed25519'
const mikeyId = '@Mq8D3YC6VdErKQzV3oi2oK5hHSoIwR0hUQr4M46wr/2=.ed25519'
const timmyId = '@Mq8D3YC6VdErKQzV3oi2oK5hHSoIwR0hUQr4M46wr/3=.ed25519'
const tommyId = '@Mq8D3YC6VdErKQzV3oi2oK5hHSoIwR0hUQr4M46wr/4=.ed25519'
const sallyId = '@Mq8D3YC6VdErKQzV3oi2oK5hHSoIwR0hUQr4M46wr/5=.ed25519'

const poll = '%t+PhrNxxXkw/jMo6mnwUWfFjJapoPWxzsQoe0Np+nYw=.sha256'

const now = Number(new Date())

const validPoll = {
  key: '%schwoop',
  value: {
    content: ChooseOnePoll({
      choices: [1, 2, 'three'],
      title: 'how many food',
      closesAt: now
    })
  }
}

test('ChooseOneResults - ChooseOneResults', function (t) {
  const positions = [
    { value: { content: ChooseOne({choice: 0, poll}), author: pietId } },
    { value: { content: ChooseOne({choice: 0, poll}), author: mixId } },
    { value: { content: ChooseOne({choice: 0, poll}), author: mikeyId } },
    { value: { content: ChooseOne({choice: 1, poll}), author: timmyId } },
    { value: { content: ChooseOne({choice: 1, poll}), author: tommyId } },
    { value: { content: ChooseOne({choice: 2, poll}), author: sallyId } }
  ]

  const expected = {
    results: [
      {
        choice: '1',
        voters: {
          [pietId]: positions[0],
          [mixId]: positions[1],
          [mikeyId]: positions[2]
        }
      },
      {
        choice: '2',
        voters: {
          [timmyId]: positions[3],
          [tommyId]: positions[4]
        }
      },
      {
        choice: 'three',
        voters: {
          [sallyId]: positions[5]
        }
      }
    ],
    errors: {}
  }

  const actual = chooseOneResults({positions, poll: validPoll})
  t.deepEqual(actual, expected, 'results are correct')
  t.end()
})

test('ChooseOneResults - a position stated for an invalid choice index is not counted', function (t) {
  const positions = [
    { value: { content: ChooseOne({choice: 3, poll}), author: pietId } }
  ]

  const actual = chooseOneResults({positions, poll: validPoll})
  t.false(actual[3], 'invalid vote is not counted')
  t.end()
})

test('ChooseOneResults - a position stated for an invalid choice index is included in the errors object', function (t) {
  const positions = [
    { value: { content: ChooseOne({choice: 3, poll}), author: pietId } }
  ]

  const actual = chooseOneResults({positions, poll: validPoll})
  t.deepEqual(actual.errors[0].type, ERROR_POSITION_CHOICE, 'invalid vote is on error object')
  t.end()
})

test('ChooseOneResults - A position stated before the closing time of the poll is counted', function (t) {
  const positions = [
    { value: { content: ChooseOne({choice: 0, poll}), author: pietId, timestamp: now - 1 } }
  ]

  const actual = chooseOneResults({positions, poll: validPoll})
  t.true(actual[0], 'valid vote is counted')
  t.end()
})

test('ChooseOneResults - A position stated after the closing time of the poll is not counted', function (t) {
  const positions = [
    { value: { content: ChooseOne({choice: 0, poll}), author: pietId, timestamp: now + 1 } }
  ]

  const actual = chooseOneResults({positions, poll: validPoll})
  t.false(actual[0], 'invalid vote is not counted')
  t.end()
})

test('ChooseOneResults - A position stated after the closing time of the poll is included in the error object', function (t) {
  const positions = [
    { value: { content: ChooseOne({choice: 0, poll}), author: pietId, timestamp: now + 1 } }
  ]

  const actual = chooseOneResults({positions, poll: validPoll})
  t.deepEqual(actual.errors[0].type, ERROR_POSITION_LATE, 'invalid vote is on error object')
  t.end()
})
