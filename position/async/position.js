const sort = require('ssb-sort')

const GetPoll = require('../../poll/async/get')
const {SCHEMA_VERSION} = require('../../types')
// var { link } = require('ssb-msg-schemas/util')
//

module.exports = function (server) {
  const getPoll = GetPoll(server)

  return function Position ({ poll = {}, details, reason, channel, mentions }, cb) {
    const content = {
      type: 'position',
      version: SCHEMA_VERSION,
      root: typeof poll === 'string' ? poll : poll.key,
      details
    }

    if (reason) content.reason = reason

    if (channel) {
      if (typeof channel !== 'string') { throw new Error('channel must be a string') }
      content.channel = channel
    }

    if (content.root && server) {
      getPoll(content.root, (err, {positions}) => {
        content.branch = sort.heads(positions)
        cb(err, content)
      })
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
