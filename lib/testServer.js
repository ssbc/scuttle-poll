// this is an annoying fix for a problem where requiring a scuttlebot
// currently instantiates one instance of SecretStack
// and installing a plugin with `#use` mutates that instance
//
// all future replies are polluted.
// PRs currently open

var Server = require('scuttle-testbot')
Server
  .use(require('ssb-backlinks'))

module.exports = Server
