var { ERROR_POSITION_CHOICE } = require('../../types')
var Error = require('./error')

module.exports = function ({position}) {
  return Error({type: ERROR_POSITION_CHOICE, position, message: 'Postion choice was not a valid choice for the poll'})
}
