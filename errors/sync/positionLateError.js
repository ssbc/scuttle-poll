var { ERROR_POSITION_LATE } = require('../../types')
var Error = require('./positionError')

module.exports = function ({position}) {
  return Error({type: ERROR_POSITION_LATE, position, message: 'Postion stated after the poll closed'})
}
