'use strict'

const Promise = require('bluebird')
const Through2 = require('through2')
const ReadFile = require('fs').createReadStream
const Reduce = Array.prototype.reduce;

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

  let punctuationsOnly = [];

  return new Promise((resolve, reject) => {
    ReadFile(filePath, options.encoding)
      /**
       * remove words, leave only punctuations and count them too!
       * ; : ' " , ! ? . ( ) -
       */
      .pipe(Through2.obj(function(chunk, _, callback) {
        for (let i = 0; i < chunk.length; i++) {
          if ( chunk[i] in punctuationsSeen ) {
            punctuationsSeen[ chunk[i] ]++
            punctuationsOnly.push(chunk[i])
          }
        }
        return callback(null, chunk)
      }))
      .on('end', _ => {
        resolve({
          body: punctuationsOnly.join(''),
          count: punctuationsSeen
        })
      })
      .on('error', error => reject(error))
  })
}

/* THE TRUTH IS OUT THERE */
module.exports = Punc