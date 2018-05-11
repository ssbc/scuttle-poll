const pull = require('pull-stream')
const pullAsync = require('pull-async')
const { heads } = require('ssb-sort')
const { isMsg } = require('ssb-ref')
const { isPoll, isPollUpdate, versionStrings: {V1_SCHEMA_VERSION_STRING} } = require('ssb-poll-schema')

module.exports = function (server) {
  return function UpdatedClosingTime ({ poll, mentions, recps, closesAt }, cb) {
    if (!isPoll(poll) && !isMsg(poll)) return cb(new Error('UpdatedClosingTime factory expects a valid poll'))

    // NOTE - getPoll has to be required here to avoid circular deps
    const getPoll = require('../../poll/async/get')(server)

    pull(
      pullAsync(cb => {
        getPoll(typeof poll === 'string' ? poll : poll.key, cb)
      }),
      pull.map(build),
      pull.drain(update => {
        if (!isPollUpdate(update)) return cb(isPollUpdate.errors)

        cb(null, update)
      })
    )

    function build (poll) {
      // NOTE - poll here is a decorated poll
      const content = {
        type: 'poll-update',
        version: V1_SCHEMA_VERSION_STRING,
        root: poll.key,
        closesAt
      }

      content.branch = heads(poll.positions.concat(poll))

      if (recps) content.recps = recps
      if (mentions) content.mentions = mentions
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
