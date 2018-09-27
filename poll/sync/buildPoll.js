// var { link } = require('ssb-msg-schemas/util')
const {versionStrings: {V1_SCHEMA_VERSION_STRING}} = require('ssb-poll-schema')

function Poll ({ details, title, closesAt, body, progenitor, channel, recps, mentions }) {
  var content = { type: 'poll', details, title, closesAt, version: V1_SCHEMA_VERSION_STRING }

  if (body) content.body = body
  if (progenitor) content.progenitor = progenitor
  if (mentions) content.mentions = mentions

  // TODO compare with scuttle-gathering pattern, potentially upgrade
  // - check errors as building, allows easy reporting of errors if you make this fn async as well
  // - introduce permitted-opts fns, use lodash.pick

  // // NOTE mentions can be derived from text,
  // // or we could leave it so you can manually notify people without having to at-mention spam the text
  // if (mentions && (!Array.isArray(mentions) || mentions.length)) {
  //   mentions = links(mentions)
  //   if (!mentions || !mentions.length) { throw new Error('mentions are not valid links') }
  //   content.mentions = mentions
  // }
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

module.exports = Poll
