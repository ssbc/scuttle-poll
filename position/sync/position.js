const { isMsg: isMsgRef } = require('ssb-ref')
// var { link } = require('ssb-msg-schemas/util')

function Position ({ poll = {}, details, reason, channel, mentions }) {
  const content = {
    type: 'position',
    root: typeof poll === 'string' ? poll : poll.key,
    details
  }

  if (reason) content.reason = reason

  // TODO branch should be calculated
  // ... this needs to be async... unless all messages are passed in

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
  if (channel) {
    if (typeof channel !== 'string') { throw new Error('channel must be a string') }
    content.channel = channel
  }

  return content
}

module.exports = Position
