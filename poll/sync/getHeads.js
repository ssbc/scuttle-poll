const { heads } = require('ssb-sort')
const getContent = require('ssb-msg-content')

module.exports = function getHeads (poll, msgs) {
  return heads([poll, ...msgs.filter(m => getContent(m).root === poll.key)])
}
