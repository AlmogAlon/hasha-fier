const { XXHash64 } = require('xxhash')
const SEED = 0x00000000

function createHash () {
  return new XXHash64(SEED)
}

module.exports = createHash
