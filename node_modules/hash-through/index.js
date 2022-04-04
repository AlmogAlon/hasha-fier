'use strict'

const { Transform } = require('readable-stream')
const setImmediate = (1, eval)('this').setImmediate
  || function (fn) { setTimeout(fn, 0) }

/**
* Effectively a PassThrough stream that taps to chunks flow
* and accumulating the hash
*/
function HashThrough (createHash) {
  const hashThrough = new Transform()

  const hash = createHash()

  hashThrough._transform = function (chunk, encoding, cb) {
    setImmediate(_ => {
      try {
        hash.update(chunk)
        cb(null, chunk)
      } catch (err) {
        cb(err)
      }
    })
  }

  // bind the digest function to hash object
  hashThrough.digest = format => hash.digest(format)

  return hashThrough
}

module.exports = HashThrough
