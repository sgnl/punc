'use strict'

// const Promise   = require('bluebird')
// const readFile  = Promise.promisify(require('fs').readFile)
const stp = require('stream-to-promise')
const readFile = require('fs').createReadStream;

/* MODULE */
function PuncModule (opts) {
  let module = {}

  return (filePath) => {
    return new Promise((resolve, reject) => {
      let promise =
        stp(readFile(filePath))
          .then(resolve)
          .catch(reject)

      return promise
    })
  };
}

/* THE TRUTH IS OUT THERE */
module.exports = PuncModule

/* HELPERS */
function countPunctuation (buffer) {
  buffer.on('data')
}