'use strict'

const { Writable } = require('readable-stream')
const setImmediate = (1, eval)('this').setImmediate
  || function (fn) { setTimeout(fn, 0) }

module.exports = DevNull

function DevNull (opts) {
  const devnull = new Writable(opts)

  devnull._write = function (chunk, encoding, cb) {
    setImmediate(cb)
  }

  return devnull
}
