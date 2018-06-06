const test = require('tape')
const pull = require('pull-stream')
const Server = require('../../../lib/testServer')
const server = Server()
const ChooseOne = require('../../../position/async/buildChooseOne')(server)
const chooseOneResults = require('../../../results/sync/buildResults')
const PublishChooseOnePoll = require('../../../poll/async/publishChooseOne')(server)
const {ERROR_POSITION_CHOICE, ERROR_POSITION_LATE, ERROR_POSITION_TYPE} = require('../../../types')

const pietId = '@Mq8D3YC6VdErKQzV3oi2oK5hHSoIwR0hUQr4M46wr/0=.ed25519'
const mixId = '@Mq8D3YC6VdErKQzV3oi2oK5hHSoIwR0hUQr4M46wr/1=.ed25519'
const mikeyId = '@Mq8D3YC6VdErKQzV3oi2oK5hHSoIwR0hUQr4M46wr/2=.ed25519'
const timmyId = '@Mq8D3YC6VdErKQzV3oi2oK5hHSoIwR0hUQr4M46wr/3=.ed25519'
const tommyId = '@Mq8D3YC6VdErKQzV3oi2oK5hHSoIwR0hUQr4M46wr/4=.ed25519'
const sallyId = '@Mq8D3YC6VdErKQzV3oi2oK5hHSoIwR0hUQr4M46wr/5=.ed25519'

const now = new Date().toISOString()

const validPoll = {
  choices: [1, 2, 'three'],
  title: 'how many food',
  closesAt: now
}

test.onFinish(() => server.close())

test('ChooseOneResults - ChooseOneResults', function (t) {
  PublishChooseOnePoll(validPoll, function (err, poll) {
    t.error(err)

    const positions = [
      { value: { content: {choice: 0, poll}, author: pietId }, key: '%dfkjd0' },
      { value: { content: {choice: 0, poll}, author: mixId }, key: '%dfkjd1' },
      { value: { content: {choice: 0, poll}, author: mikeyId }, key: '%dfkjd2' },
      { value: { content: {choice: 1, poll}, author: timmyId }, key: '%dfkjd3' },
      { value: { content: {choice: 1, poll}, author: tommyId }, key: '%dfkjd4' },
      { value: { content: {choice: 2, poll}, author: sallyId }, key: '%dfkjd5' }
    ]

    const expected = {
      results: [
        {
          choice: 1,
          voters: {
            [pietId]: positions[0],
            [mixId]: positions[1],
            [mikeyId]: positions[2]
          }
        },
        {
          choice: 2,
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

    pull(
      pull.values(positions),
      pull.asyncMap((fullPosition, cb) => {
        var positionAndPoll = Object.assign({}, fullPosition.value.content, { poll })
        ChooseOne(positionAndPoll, (err, position) => {
          fullPosition.value.content = position
          cb(err, fullPosition)
        })
      }),
      pull.collect((err, positions) => {
        t.error(err)
        const actual = chooseOneResults({positions, poll})
        t.deepEqual(actual, expected, 'results are correct')
        t.end()
      })
    )
  })
})

test('ChooseOneResults - a position stated for an invalid choice index is not counted', function (t) {
  PublishChooseOnePoll(validPoll, function (err, poll) {
    t.error(err)
    const positions = [
      { value: { content: {choice: 2, poll}, author: pietId }, key: '%dfkjdf' }
    ]

    pull(
      pull.values(positions),
      pull.asyncMap((fullPosition, cb) => {
        var positionAndPoll = Object.assign({}, fullPosition.value.content, { poll })
        ChooseOne(positionAndPoll, (err, position) => {
          t.error(err)
          position.details.choice = 3
          fullPosition.value.content = position
          cb(err, fullPosition)
        })
      }),
      pull.collect((err, positions) => {
        t.error(err)
        const actual = chooseOneResults({positions, poll})
        t.false(actual.results[3], 'invalid vote is not counted')
        t.end()
      })
    )
  })
})

test('ChooseOneResults - a position of the wrong type  is not counted', function (t) {
  PublishChooseOnePoll(validPoll, function (err, poll) {
    t.error(err)
    const positions = [
      { value: { content: {choice: 2, poll}, author: pietId }, key: '%dfkjdf' }
    ]

    pull(
      pull.values(positions),
      pull.asyncMap((fullPosition, cb) => {
        var positionAndPoll = Object.assign({}, fullPosition.value.content, { poll })
        ChooseOne(positionAndPoll, (err, position) => {
          t.error(err)
          fullPosition.value.content = position
          cb(err, fullPosition)
        })
      }),
      pull.collect((err, positions) => {
        t.error(err)
        positions[0].value.content.details.type = 'INVALID'
        const actual = chooseOneResults({positions, poll})
        t.false(actual.results[3], 'invalid vote is not counted')
        t.end()
      })
    )
  })
})

test('ChooseOneResults - a position stated for an invalid positionType is included in the errors object', function (t) {
  PublishChooseOnePoll(validPoll, function (err, poll) {
    t.error(err)
    const positions = [
      { value: { content: {choice: 2, poll}, author: pietId }, key: '%fdfslkjdf' }
    ]

    pull(
      pull.values(positions),
      pull.asyncMap((fullPosition, cb) => {
        var positionAndPoll = Object.assign({}, fullPosition.value.content, { poll })
        ChooseOne(positionAndPoll, (err, position) => {
          t.error(err)
          fullPosition.value.content = position
          cb(err, fullPosition)
        })
      }),
      pull.collect((err, positions) => {
        t.error(err)
        positions[0].value.content.details.type = 'INVALID'
        const actual = chooseOneResults({positions, poll})
        t.deepEqual(actual.errors[0].type, ERROR_POSITION_TYPE, 'invalid vote is on error object')
        t.end()
      })
    )
  })
})

test('ChooseOneResults - a position stated for an invalid choice index is included in the errors object', function (t) {
  PublishChooseOnePoll(validPoll, function (err, poll) {
    t.error(err)
    const positions = [
      { value: { content: {choice: 2, poll}, author: pietId }, key: '%fdfslkjdf' }
    ]

    pull(
      pull.values(positions),
      pull.asyncMap((fullPosition, cb) => {
        var positionAndPoll = Object.assign({}, fullPosition.value.content, { poll })
        ChooseOne(positionAndPoll, (err, position) => {
          t.error(err)
          position.details.choice = 3
          fullPosition.value.content = position
          cb(err, fullPosition)
        })
      }),
      pull.collect((err, positions) => {
        t.error(err)
        const actual = chooseOneResults({positions, poll})
        t.deepEqual(actual.errors[0].type, ERROR_POSITION_CHOICE, 'invalid vote is on error object')
        t.end()
      })
    )
  })
})

test('ChooseOneResults - A position stated before the closing time of the poll is counted', function (t) {
  PublishChooseOnePoll(validPoll, function (err, poll) {
    t.error(err)
    const positions = [
      { value: { content: {choice: 0, poll}, author: pietId, timestamp: now - 1 }, key: '%dfkjsdlkjf'}
    ]

    pull(
      pull.values(positions),
      pull.asyncMap((fullPosition, cb) => {
        var positionAndPoll = Object.assign({}, fullPosition.value.content, { poll })
        ChooseOne(positionAndPoll, (err, position) => {
          fullPosition.value.content = position
          cb(err, fullPosition)
        })
      }),
      pull.collect((err, positions) => {
        t.error(err)
        const actual = chooseOneResults({positions, poll})
        t.ok(actual.results[0].voters[pietId], 'valid vote is counted')
        t.end()
      })
    )
  })
})

test('ChooseOneResults - A position stated after the closing time of the poll is not counted', function (t) {
  PublishChooseOnePoll(validPoll, function (err, poll) {
    t.error(err)
    const positions = [
      { value: { content: {choice: 0, poll}, author: pietId, timestamp: now + 1 }, key: '%dfljsdkdj'}
    ]

    pull(
      pull.values(positions),
      pull.asyncMap((fullPosition, cb) => {
        var positionAndPoll = Object.assign({}, fullPosition.value.content, { poll })
        ChooseOne(positionAndPoll, (err, position) => {
          fullPosition.value.content = position
          cb(err, fullPosition)
        })
      }),
      pull.collect((err, positions) => {
        t.error(err)
        const actual = chooseOneResults({positions, poll})
        t.deepEqual(actual.results[0].voters, {}, 'invalid vote is not counted')
        t.end()
      })
    )
  })
})

test('ChooseOneResults - A position stated after the closing time of the poll is included in the error object', function (t) {
  PublishChooseOnePoll(validPoll, function (err, poll) {
    t.error(err)
    const positions = [
      { value: { content: {choice: 0, poll}, author: pietId, timestamp: now + 1 }, key: '%dfrdkjfd' }
    ]

    pull(
      pull.values(positions),
      pull.asyncMap((fullPosition, cb) => {
        var positionAndPoll = Object.assign({}, fullPosition.value.content, { poll })
        ChooseOne(positionAndPoll, (err, position) => {
          fullPosition.value.content = position
          cb(err, fullPosition)
        })
      }),
      pull.collect((err, positions) => {
        t.error(err)
        const actual = chooseOneResults({positions, poll})
        t.deepEqual(actual.errors[0].type, ERROR_POSITION_LATE, 'invalid vote is on error object')
        t.end()
      })
    )
  })
})

test('ChooseOneResults - ChooseOneResults only counts latest vote by an author', function (t) {
  PublishChooseOnePoll(validPoll, function (err, poll) {
    t.error(err)
    const positions = [
      { value: { content: {choice: 2, poll}, author: pietId }, key: '%dfrdkjfd' },
      { value: { content: {choice: 0, poll}, author: pietId }, key: '%dfrdkjf3' }
    ]

    pull(
      pull.values(positions),
      pull.asyncMap((fullPosition, cb) => {
        var positionAndPoll = Object.assign({}, fullPosition.value.content, { poll })
        ChooseOne(positionAndPoll, (err, position) => {
          fullPosition.value.content = position
          cb(err, fullPosition)
        })
      }),
      pull.collect((err, positions) => {
        t.error(err)
        const actual = chooseOneResults({positions, poll})
        t.false(actual.results[2].voters[pietId], 'old vote is deleted')
        t.true(actual.results[0].voters[pietId], 'new vote is counted')
        t.end()
      })
    )
  })
})
