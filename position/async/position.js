const pull = require('pull-stream')
const pullAsync = require('pull-async')
const GetPoll = require('../../poll/async/get')
const sort = require('ssb-sort')
// var { link } = require('ssb-msg-schemas/util')
//

module.exports = function (server) {
  const getPoll = GetPoll(server)

  return function Position ({ poll = {}, details, reason, channel, mentions }, cb) {
    const content = {
      type: 'position',
      root: typeof poll === 'string' ? poll : poll.key,
      details
    }

    if (reason) content.reason = reason

    if (channel) {
      if (typeof channel !== 'string') { throw new Error('channel must be a string') }
      content.channel = channel
    }

    if (content.root && server) {
      pull(
        pullAsync(cb => {
          getPoll(content.root, cb)
        }),
        pull.drain(({positions}) => {
          content.branch = sort.heads(positions)
          cb(null, content)
        })
      )
    } else {
      cb(null, content)
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
