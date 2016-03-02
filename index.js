'use strict'

const Promise   = require('bluebird')
const Through2  = require('through2')
const ReadFile  = require('fs').createReadStream
const ForEach   = [].forEach

/* MODULE */
function Punc(filePath, options){
  if (!filePath) throw new Error('Punc: file path not given.')
  if (!options) {
    options = { encoding: 'utf8' }
  } else if (typeof options === 'string') {
    options = { encoding: options }
  } else if (typeof options !== 'object') {
    throw new TypeError(`Punc: expected options to be either
      an object or a string, but got ${typeof options} instead`
    )
  }

  let punctuationsOnly = []
  let wordsPerSentenceCount = 0
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
      .pipe(removeCarriageReturn())
      .pipe(removeDoubleSpaces())
      .pipe(wordsPerSentence(count => wordsPerSentenceCount = count))
      .pipe(findPunctuationsAndCount(punctuationsSeen, punctuationsOnly))
      .on('data', _ => _)
      .on('end', _ => {
        console.log('end count:', wordsPerSentenceCount)
        return resolve({ body: punctuationsOnly.join('')
        , count: punctuationsSeen
        , wordsPerSentence: wordsPerSentenceCount
        })
      })
      .on('error', error => reject(error))
  })
}

function removeCarriageReturn () {
  return Through2.obj(function(chunk, _, callback) {
    chunk = chunk.replace(/\r/g, '')

    callback(null, chunk)
  })
}

function removeDoubleSpaces () {
  return Through2.obj(function(chunk, _, callback) {
    chunk = chunk.replace(/\s\s+/g, ' ')

    callback(null, chunk)
  })
}

function wordsPerSentence (changeCount) {
  return Through2.obj(function(chunk, _, callback) {
    let periodCount = (chunk.match(/\.|\?|\!/g) || []).length
    let wordCount = chunk.split(' ').length

    changeCount(wordCount / periodCount)

    callback(null, chunk)
  })
}

function findPunctuationsAndCount (map, dest) {
  return Through2.obj(function(chunk, _, callback) {
    ForEach.call(chunk, punctuation => {
      if ( punctuation in map ) {
        map[ punctuation ]++
        dest.push(punctuation)
      }
    })
    callback()
  })
}

/* THE TRUTH IS OUT THERE */
module.exports = Punc

