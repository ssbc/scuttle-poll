const sort = require('ssb-sort')
const pull = require('pull-stream')
const pullAsync = require('pull-async')
// var { link } = require('ssb-msg-schemas/util')

const isPosition = require('../../isPosition')
// const GetPoll = require('../../poll/async/get') // ??!!! DOESN't WORK

module.exports = function (server) {
  // const getPoll = GetPoll(server) // ??!!! DOESN't WORK

  return function Position ({ poll = {}, details, reason, mentions }, cb) {
    // const getPoll = GetPoll(server) // ??!!! DOESN't WORK
    const getPoll = require('../../poll/async/get')(server) // WORKS?!!!  T_T

    const content = {
      type: 'position',
      root: typeof poll === 'string' ? poll : poll.key,
      details
    }

    pull(
      pullAsync(cb => {
        if (poll.decorated) cb(null, poll)
        else getPoll(content.root, cb)
      }),
      pull.map(autoFillContent),
      pull.drain(content => {
        if (!isPosition(content)) return cb(new Error('not a valid position'))

        server.publish(content, cb)
      })
    )

    function autoFillContent (poll) {
      content.branch = sort.heads(poll.positions)
      if (reason) content.reason = reason
      if (poll.channel) content.channel = poll.channel
      return content
    }

    // // NOTE mentions can be derived from text,
    // // or we could leave it so you can manually notify people without having to at-mention spam the text
    // if (mentions && (!Array.isArray(mentions) || mentions.length)) {
    //   mentions = links(mentions)
    //   if (!mentions || !mentions.length) { throw new Error('mentions are not valid links') }
    //   content.mentions = mentions
    // }

    // // NOTE recps should be derived from the poll I think
    // if (recps && (!Array.isArray(recps) || recps.length)) {
    //   recps = links(recps)
    //   if (!recps || !recps.length) { throw new Error('recps are not valid links') }
    //   content.recps = recps
    // }
  }
}
