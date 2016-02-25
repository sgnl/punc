'use strict'

const Promise   = require('bluebird')
const readFile  = Promise.promisify(require('fs').readFile)

function PuncModule (opts) {
  let module = {}

  module.parse = (filePath) => {
    let promise = readFile(filePath, 'utf-8')
      .then( fileContents => fileContents )

    return promise
  };

  return module
}

module.exports = PuncModule

