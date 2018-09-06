const pull = require('pull-stream')
const pullAsync = require('pull-async')
const { isMsg } = require('ssb-ref')
const { isPoll, isPollResolution, versionStrings: {V1_SCHEMA_VERSION_STRING} } = require('ssb-poll-schema')

module.exports = function (server) {
  return function Resolution ({ poll, choices, body, mentions, recps }, cb) {
    if (!isPoll(poll) && !isMsg(poll)) return cb(new Error('Resolution factory expects a valid poll'))

    function build (pollDoc) {
      // NOTE - poll here is a decorated poll
      const content = {
        type: 'poll-resolution',
        version: V1_SCHEMA_VERSION_STRING,
        choices,
        root: pollDoc.key,
        branch: pollDoc.heads
      }

      if (body) content.body = body
      if (recps) content.recps = recps
      if (mentions) content.mentions = mentions
      if (poll.channel) content.channel = poll.channel

      return content
    }

    // NOTE - getPoll has to be required here to avoid circular deps
    const getPoll = require('../../poll/async/get')(server)
    pull(
      pullAsync(cb => {
        getPoll(typeof poll === 'string' ? poll : poll.key, cb)
      }),
      pull.map(build),
      pull.drain(resolution => {
        if (!isPollResolution(resolution)) return cb(isPollResolution.errors)

        cb(null, resolution)
      })
    )
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
