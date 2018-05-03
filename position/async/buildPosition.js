const pull = require('pull-stream')
const pullAsync = require('pull-async')
const { heads } = require('ssb-sort')
const { isMsg } = require('ssb-ref')
const { isPoll, isPosition, versionStrings: {V1_SCHEMA_VERSION_STRING} } = require('ssb-poll-schema')

module.exports = function (server) {
  return function Position ({ poll, details, reason, mentions }, cb) {
    if (!isPoll(poll) && !isMsg(poll)) return cb(new Error('Position factory expects a valid poll'))

    // NOTE - getPoll has to be required here to avoid circular deps
    const getPoll = require('../../poll/async/get')(server)

    pull(
      pullAsync(cb => {
        getPoll(typeof poll === 'string' ? poll : poll.key, cb)
      }),
      pull.map(build),
      pull.drain(position => {
        if (!isPosition(position)) return cb(isPosition.errors)

        cb(null, position)
      })
    )

    function build (poll) {
      // NOTE - poll here is a decorated poll
      const content = {
        type: 'position',
        version: V1_SCHEMA_VERSION_STRING,
        root: poll.key,
        details
      }

      content.branch = heads(poll.positions || [])

      if (reason) content.reason = reason
      if (poll.channel) content.channel = poll.channel
      if (mentions) content.mentions = mentions

      return content
    }
  }
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
