const test = require('tape')
const pull = require('pull-stream')
const Server = require('../../../lib/testServer')
const server = Server()
const MeetingTime = require('../../../position/async/buildMeetingTime')(server)
const meetingTimeResults = require('../../../results/sync/buildResults')
const publishMeetingTimePoll = require('../../../poll/async/publishMeetingTime')(server)
const {ERROR_POSITION_CHOICE, ERROR_POSITION_LATE, ERROR_POSITION_TYPE} = require('../../../types')

const pietId = '@Mq8D3YC6VdErKQzV3oi2oK5hHSoIwR0hUQr4M46wr/0=.ed25519'
const mixId = '@Mq8D3YC6VdErKQzV3oi2oK5hHSoIwR0hUQr4M46wr/1=.ed25519'
const mikeyId = '@Mq8D3YC6VdErKQzV3oi2oK5hHSoIwR0hUQr4M46wr/2=.ed25519'
const timmyId = '@Mq8D3YC6VdErKQzV3oi2oK5hHSoIwR0hUQr4M46wr/3=.ed25519'
const tommyId = '@Mq8D3YC6VdErKQzV3oi2oK5hHSoIwR0hUQr4M46wr/4=.ed25519'
const sallyId = '@Mq8D3YC6VdErKQzV3oi2oK5hHSoIwR0hUQr4M46wr/5=.ed25519'

const now = Date.now()

const validPoll = {
  choices: [
    new Date(2018, 7, 21).toISOString(),
    new Date(2018, 7, 22).toISOString(),
    new Date(2018, 7, 23).toISOString()
  ],
  title: 'how many food',
  closesAt: new Date(now).toISOString()
}

test.onFinish(() => server.close())

test('MeetingTimeResults - MeetingTimeResults', function (t) {
  publishMeetingTimePoll(validPoll, function (err, poll) {
    t.error(err)

    const positions = [
      { value: { content: {choices: [0]}, author: pietId }, key: '%dfkjd0' },
      { value: { content: {choices: [0, 1]}, author: mixId }, key: '%dfkjd1' },
      { value: { content: {choices: [1]}, author: mikeyId }, key: '%dfkjd2' },
      { value: { content: {choices: [1]}, author: timmyId }, key: '%dfkjd3' },
      { value: { content: {choices: [1, 2]}, author: tommyId }, key: '%dfkjd4' },
      { value: { content: {choices: [2]}, author: sallyId }, key: '%dfkjd5' }
    ]
    // content in these will be replaced with legit content later

    const expected = {
      results: [
        {
          choice: new Date(validPoll.choices[0]),
          voters: {
            [pietId]: positions[0],
            [mixId]: positions[1]
          }
        },
        {
          choice: new Date(validPoll.choices[1]),
          voters: {
            [mixId]: positions[1],
            [mikeyId]: positions[2],
            [timmyId]: positions[3],
            [tommyId]: positions[4]
          }
        },
        {
          choice: new Date(validPoll.choices[2]),
          voters: {
            [tommyId]: positions[4],
            [sallyId]: positions[5]
          }
        }
      ],
      errors: {}
    }

    pull(
      pull.values(positions),
      pull.asyncMap((fullPosition, cb) => {
        const opts = { poll, choices: fullPosition.value.content.choices }

        MeetingTime(opts, (err, position) => {
          // mocking out the publishing process
          fullPosition.value.content = position
          cb(err, fullPosition)
        })
      }),
      pull.collect((err, positions) => {
        t.error(err)

        const actual = meetingTimeResults({positions, poll})
        t.deepEqual(actual, expected, 'results are correct')
        t.end()
      })
    )
  })
})

test('MeetingTimeResults - a position stated for an invalid choice index is not counted', function (t) {
  publishMeetingTimePoll(validPoll, function (err, poll) {
    t.error(err)
    const positions = [
      { value: { content: {choices: [2]}, author: pietId }, key: '%dfkjdf' }
    ]

    pull(
      pull.values(positions),
      pull.asyncMap((fullPosition, cb) => {
        var positionAndPoll = Object.assign({}, fullPosition.value.content, { poll })
        MeetingTime(positionAndPoll, (err, position) => {
          t.error(err)
          position.details.choices = [3] // << have to create invalid choice here as our builder is too good!
          fullPosition.value.content = position
          cb(err, fullPosition)
        })
      }),
      pull.collect((err, positions) => {
        t.error(err)
        const actual = meetingTimeResults({positions, poll})
        t.false(actual.results[3], 'invalid vote is not counted')
        t.end()
      })
    )
  })
})

test('MeetingTimeResults - a position of the wrong type is not counted', function (t) {
  publishMeetingTimePoll(validPoll, function (err, poll) {
    t.error(err)
    const positions = [
      { value: { content: {choices: [2]}, author: pietId }, key: '%dfkjdf' }
    ]

    pull(
      pull.values(positions),
      pull.asyncMap((fullPosition, cb) => {
        var positionAndPoll = Object.assign({}, fullPosition.value.content, { poll })
        MeetingTime(positionAndPoll, (err, position) => {
          t.error(err)
          fullPosition.value.content = position
          cb(err, fullPosition)
        })
      }),
      pull.collect((err, positions) => {
        t.error(err)
        positions[0].value.content.details.type = 'INVALID'
        const actual = meetingTimeResults({positions, poll})
        t.false(actual.results[3], 'invalid vote is not counted')
        t.end()
      })
    )
  })
})

test('MeetingTimeResults - a position stated for an invalid positionType is included in the errors object', function (t) {
  publishMeetingTimePoll(validPoll, function (err, poll) {
    t.error(err)
    const positions = [
      { value: { content: {choices: [2]}, author: pietId }, key: '%fdfslkjdf' }
    ]

    pull(
      pull.values(positions),
      pull.asyncMap((fullPosition, cb) => {
        var positionAndPoll = Object.assign({}, fullPosition.value.content, { poll })
        MeetingTime(positionAndPoll, (err, position) => {
          t.error(err)
          fullPosition.value.content = position
          cb(err, fullPosition)
        })
      }),
      pull.collect((err, positions) => {
        t.error(err)
        positions[0].value.content.details.type = 'INVALID'

        const actual = meetingTimeResults({positions, poll})
        t.deepEqual(actual.errors[0].type, ERROR_POSITION_TYPE, 'invalid vote is on error object')
        t.end()
      })
    )
  })
})

test('MeetingTimeResults - a position stated for an invalid choice index is included in the errors object', function (t) {
  publishMeetingTimePoll(validPoll, function (err, poll) {
    t.error(err)
    const positions = [
      { value: { content: {choices: [2]}, author: pietId }, key: '%fdfslkjdf' }
    ]

    pull(
      pull.values(positions),
      pull.asyncMap((fullPosition, cb) => {
        var positionAndPoll = Object.assign({}, fullPosition.value.content, { poll })
        MeetingTime(positionAndPoll, (err, position) => {
          t.error(err)
          position.details.choices = [3]
          fullPosition.value.content = position
          cb(err, fullPosition)
        })
      }),
      pull.collect((err, positions) => {
        t.error(err)
        const actual = meetingTimeResults({positions, poll})
        t.deepEqual(actual.errors[0].type, ERROR_POSITION_CHOICE, 'invalid vote is on error object')
        t.end()
      })
    )
  })
})

test('MeetingTimeResults - A position stated before the closing time of the poll is counted', function (t) {
  publishMeetingTimePoll(validPoll, function (err, poll) {
    t.error(err)
    const positions = [
      { value: { content: {choices: [0]}, author: pietId, timestamp: now - 1e3 }, key: '%dfkjsdlkjf'}
    ]

    pull(
      pull.values(positions),
      pull.asyncMap((fullPosition, cb) => {
        var positionAndPoll = Object.assign({}, fullPosition.value.content, { poll })
        MeetingTime(positionAndPoll, (err, position) => {
          fullPosition.value.content = position
          cb(err, fullPosition)
        })
      }),
      pull.collect((err, positions) => {
        t.error(err)
        const actual = meetingTimeResults({positions, poll})
        t.ok(actual.results[0].voters[pietId], 'valid vote is counted')
        t.end()
      })
    )
  })
})

test('MeetingTimeResults - A position stated after the closing time of the poll is not counted', function (t) {
  publishMeetingTimePoll(validPoll, function (err, poll) {
    t.error(err)
    const positions = [
      { value: { content: {choices: [0, 1]}, author: pietId, timestamp: now + 1e3 }, key: '%dfljsdkdj'}
    ]

    pull(
      pull.values(positions),
      pull.asyncMap((fullPosition, cb) => {
        var positionAndPoll = Object.assign({}, fullPosition.value.content, { poll })
        MeetingTime(positionAndPoll, (err, position) => {
          fullPosition.value.content = position
          cb(err, fullPosition)
        })
      }),
      pull.collect((err, positions) => {
        t.error(err)
        const actual = meetingTimeResults({positions, poll})
        t.deepEqual(actual.results[0].voters, {}, 'invalid vote is not counted')
        t.end()
      })
    )
  })
})

test('MeetingTimeResults - A position stated after the closing time of the poll is included in the error object', function (t) {
  publishMeetingTimePoll(validPoll, function (err, poll) {
    t.error(err)
    const positions = [
      { value: { content: {choices: [0]}, author: pietId, timestamp: now + 1e3 }, key: '%dfrdkjfd' }
    ]

    pull(
      pull.values(positions),
      pull.asyncMap((fullPosition, cb) => {
        var positionAndPoll = Object.assign({}, fullPosition.value.content, { poll })
        MeetingTime(positionAndPoll, (err, position) => {
          fullPosition.value.content = position
          cb(err, fullPosition)
        })
      }),
      pull.collect((err, positions) => {
        t.error(err)
        const actual = meetingTimeResults({positions, poll})
        t.deepEqual(actual.errors[0].type, ERROR_POSITION_LATE, 'invalid vote is on error object')
        t.end()
      })
    )
  })
})

test('MeetingTimeResults - MeetingTimeResults only counts latest vote by an author', function (t) {
  publishMeetingTimePoll(validPoll, function (err, poll) {
    t.error(err)
    const positions = [
      { value: { content: {choices: [2, 0], poll}, author: pietId }, key: '%dfrdkjfd' },
      { value: { content: {choices: [0], poll}, author: pietId }, key: '%dfrdkjf3' }
    ]

    pull(
      pull.values(positions),
      pull.asyncMap((fullPosition, cb) => {
        var positionAndPoll = Object.assign({}, fullPosition.value.content, { poll })
        MeetingTime(positionAndPoll, (err, position) => {
          fullPosition.value.content = position
          cb(err, fullPosition)
        })
      }),
      pull.collect((err, positions) => {
        t.error(err)
        const actual = meetingTimeResults({positions, poll})
        t.false(actual.results[2].voters[pietId], 'old vote is deleted')
        t.true(actual.results[0].voters[pietId], 'new vote is counted')
        t.end()
      })
    )
  })
})
