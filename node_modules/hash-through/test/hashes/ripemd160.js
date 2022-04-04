const crypto = require('crypto')

function createHash () {
  return crypto.createHash('ripemd160')
}

module.exports = createHash
