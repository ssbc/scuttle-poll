const pull = require('pull-stream')
const sort = require('ssb-sort')
const isPoll = require('../../isPoll')
const isPosition = require('../../isPosition')
const { ERROR_POSITION_TYPE } = require('../../types')
const results = require('../../position/sync/chooseOneResults')

module.exports = function (server) {
  return function get (key, cb) {
    server.get(key, (err, value) => {
      if (err) return cb(err)

      var poll = { key, value }
      if (!isPoll(poll)) return cb(new Error('scuttle-poll could not fetch, key provided was not a valid poll key'))

      pull(
        createBacklinkStream(key),
        pull.collect((err, msgs) => {
          if (err) return cb(err)

          console.log('got the msgs!!')
          cb(null, decoratedPoll(poll, msgs))
        })
      )
    })
  }

  function createBacklinkStream (key) {
    var filterQuery = {
      $filter: {
        dest: key
      }
    }

    return server.backlinks.read({
      query: [filterQuery],
      index: 'DTA' // use asserted timestamps
    })
  }
}

function decoratedPoll (rawPoll, msgs = []) {
  const { title, body } = rawPoll.value.content

  const poll = Object.assign({}, rawPoll, {
    title,
    body,

    positions: [],
    results: {},
    errors: []

    // publishPosition:  TODO ? add pre-filled helper functions to the poll?
  })

  // TODO add missingContext warnings to each msg
  msgs = sort(msgs)

  // filter position message into 'positions' and 'errors'
  const type = poll.value.content.pollDetails.type
  msgs.forEach(msg => {
    if (isPosition[type](msg)) {
      // TODO validator checks right position shape, but needs to add e.g. acceptible position ranges based on poll
      poll.positions.push(msg)
      return
    }

    if (isPosition(msg)) {
      poll.errors.push({
        type: ERROR_POSITION_TYPE,
        message: `Position responses need to be off the ${type} type for this poll`,
        position: msg
      })
    }
  })

  poll.results = results(poll.positions)

  return poll
}
