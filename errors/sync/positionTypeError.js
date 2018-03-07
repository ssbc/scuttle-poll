var { ERROR_POSITION_TYPE } = require('../../types')
var Error = require('./error')

module.exports = function ({position}) {
  return Error({type: ERROR_POSITION_TYPE, position, message: 'Postion stated was the wrong type for this poll'})
}
