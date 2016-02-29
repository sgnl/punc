'use strict'

const Promise   = require('bluebird')
const Through2  = require('through2')
const ReadFile  = require('fs').createReadStream
const ForEach   = [].forEach

/* MODULE */
function Punc(filePath, options){
  if (!options) {
    options = { encoding: 'utf8' }
  } else if (typeof options === 'string') {
    options = { encoding: options }
  } else if (typeof options !== 'object') {
    throw new TypeError(
      'Punc: expected options to be either an object or a \
      string, ' + 'but got ' + typeof options + ' instead'
    )
  }

  let punctuationsOnly = []
  let punctuationsSeen = { ';': 0
    , ':': 0
    , "'": 0
    , '"': 0
    , ',': 0
    , '!': 0
    , '?': 0
    , '.': 0
    , '(': 0
    , ')': 0
    , '-': 0
    }

  return new Promise((resolve, reject) => {
    ReadFile(filePath, options.encoding)
      .pipe(Through2.obj(function(chunk, _, callback) {
        ForEach.call(chunk, each => {
          if ( each in punctuationsSeen ) {
            punctuationsSeen[ each ]++
            punctuationsOnly.push(each)
          }
        })
        callback()
      }))
      .on('data', _ => _)
      .on('end', _ => resolve({ body: punctuationsOnly.join('')
        , count: punctuationsSeen
        }))
      .on('error', error => reject(error))
  })
}

/* THE TRUTH IS OUT THERE */
module.exports = Punc