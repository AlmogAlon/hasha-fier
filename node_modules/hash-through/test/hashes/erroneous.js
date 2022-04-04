// let's make a createHash implementation that
// returns a hash object producing an error when
// update is called

const hash = {
  update (chunk) {
    throw new Error('hash function update call error')
  },
  digest (format) {
    return 'fake digest, sorry.'
  }
}

function createHash () {
  return hash
}

module.exports = createHash
