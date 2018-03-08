module.exports = function PositionError ({type, position, message}) {
  var error = {type, position, message}

  return error
}
