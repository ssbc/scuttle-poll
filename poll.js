var Validate = require('is-my-json-valid')
var { schema, validate } = require('./schema/poll.js')
var { schema : chooseOneSchema, create: chooseOneCreate, isValidTypeString: isValidChooseOneTypeString } = require('./schema/pollTypes/chooseOne.js')
var { link } = require('ssb-msg-schemas/util')

function create({text, mentions, recps, channel, pollType, root, branch}){
  var content = { type: 'poll', text, pollType}
  if (root) {
    root = link(root)
    if (!root)
      throw new Error('root is not a valid link')
    content.root = root
  }
  if (branch) {
    if (!root)
      throw new Error('root is not a valid link')
    branch = Array.isArray(branch) ? branch.map(link) : link(branch)
    if (!branch)
      throw new Error('branch is not a valid link')
    content.branch = branch
  }
  if (mentions && (!Array.isArray(mentions) || mentions.length)) {
    mentions = links(mentions)
    if (!mentions || !mentions.length)
      throw new Error('mentions are not valid links')
    content.mentions = mentions
  }
  if (recps && (!Array.isArray(recps) || recps.length)) {
    recps = links(recps)
    if (!recps || !recps.length)
      throw new Error('recps are not valid links')
    content.recps = recps
  }
  if (channel) {
    if (typeof channel !== 'string')
      throw new Error('channel must be a string')
    content.channel = channel
  }

  if(isValidChooseOneTypeString(pollType.type)){
    content.pollType = chooseOneCreate({choices: pollType.choices})
  }

  return content
}

module.exports = {
  create,
  schema,
  validate
}
