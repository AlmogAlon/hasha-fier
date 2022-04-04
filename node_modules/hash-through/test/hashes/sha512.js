const crypto = require('crypto')

function createHash () {
  return crypto.createHash('sha512')
}

module.exports = createHash
