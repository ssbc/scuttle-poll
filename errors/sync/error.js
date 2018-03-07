module.exports = function Error ({type, position, message}) {
  var error = {type, position, message}

  return error
}
