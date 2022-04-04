const { assert } = require('chai')
const fs = require('fs')
const path = require('path')
const HashThrough = require('../')
const DevNull = require('./devnull')

describe('HashThrough', function () {
  let src
  let devnull

  beforeEach(function () {
    src = fs.createReadStream(path.resolve(__dirname, 'sample.txt'))
    devnull = DevNull()
  })

  it('Should work with crypto sha256 hash function', async function () {
    const createHash = require('./hashes/sha256')
    const expected = '1b84ae5fc0f2813dba68d20b159f8e0635a75c1d8cf175275da2daac40b131bd'

    const hashThrough = HashThrough(createHash)

    src.pipe(hashThrough).pipe(devnull)

    await eventPromise(hashThrough, 'finish')

    const digest = hashThrough.digest('hex')
    assert.equal(digest, expected, 'sha256 digest of a sample data stream')
  })

  it('Should work with crypto sha512 hash function', async function () {
    const createHash = require('./hashes/sha512')
    const expected = 'd5afe4b9acd7ec9ebf2fe6e87ef1853ed7080d3e5c1d144bdebe115e969ebe269de3837f326b76acc370e59cfd88c0ab4c1ae6af8382f46f047023e6e96a0559'

    const hashThrough = HashThrough(createHash)

    src.pipe(hashThrough).pipe(devnull)

    await eventPromise(hashThrough, 'finish')

    const digest = hashThrough.digest('hex')
    assert.equal(digest, expected, 'sha512 digest of a sample data stream')
  })

  it('Should work with crypto ripemd160 hash function', async function () {
    const createHash = require('./hashes/ripemd160')
    const expected = '4fff5196ef6058c0af1ef4a2b82b75ea3afc3e1b'
    const hashThrough = HashThrough(createHash)

    src.pipe(hashThrough).pipe(devnull)

    await eventPromise(hashThrough, 'finish')

    const digest = hashThrough.digest('hex')
    assert.equal(digest, expected, 'ripemd160 digest of a sample data stream')
  })

  it('Should work with murmurHash3 (128_86_le) hash function', async function () {
    const createHash = require('./hashes/murmur3_native_128_86_le')
    const expected = 'f8b54461d79f651a9c64c617ebd15985'
    const hashThrough = HashThrough(createHash)

    src.pipe(hashThrough).pipe(devnull)

    await eventPromise(hashThrough, 'finish')

    const digest = hashThrough.digest('hex')
    assert.equal(digest, expected, 'murmurHash3 128_86_le digest of a sample data stream')
  })

  it('Should work with murmurHash3 (128_64_le) hash function', async function () {
    const createHash = require('./hashes/murmur3_native_128_64_le')
    const expected = '2eef21fa9d8fb68e6839c1b2fc92eac0'
    const hashThrough = HashThrough(createHash)

    src.pipe(hashThrough).pipe(devnull)

    await eventPromise(hashThrough, 'finish')

    const digest = hashThrough.digest('hex')
    assert.equal(digest, expected, 'murmurHash3 128_64_le digest of a sample data stream')
  })

  it('Should work with xxHash64 hash function', async function () {
    const createHash = require('./hashes/xxhash64')
    const expected = '72f98ab7c9d44a85'
    const hashThrough = HashThrough(createHash)

    src.pipe(hashThrough).pipe(devnull)

    await eventPromise(hashThrough, 'finish')

    const digest = hashThrough.digest('hex')
    assert.equal(digest, expected, 'xxhash64 digest of a sample data stream')
  })

  it('Should work with MetroHash128 hash function', async function () {
    const createHash = require('./hashes/metrohash')
    const expected = 'ba089843d132af3231990d405f2ac3c0'
    const hashThrough = HashThrough(createHash)

    src.pipe(hashThrough).pipe(devnull)

    await eventPromise(hashThrough, 'finish')

    const digest = hashThrough.digest('hex')
    assert.equal(digest, expected, 'MetroHash128 digest of a sample data stream')
  })

  it('Should handle error in hash.update', async function () {
    const createHash = require('./hashes/erroneous')

    const hashThrough = HashThrough(createHash)

    src.pipe(hashThrough).pipe(devnull)

    let err = await eventPromise(hashThrough, 'error')

    assert.isDefined(err, 'hash.update error detection')
    assert.isTrue(Array.isArray(err))
    assert.equal(err[0].message, 'hash function update call error')
  })
})

/**
* Wrap an event emmiting object event handler in such a way,
* that when the event is detected, the promise get resolved.
*/
function eventPromise (emitter, eventName) {
  return new Promise((resolve, reject) => {
    emitter.on(eventName, (...args) => {
      resolve(args)
    })
  })
}
