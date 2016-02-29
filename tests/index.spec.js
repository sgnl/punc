'use strict'

const Test = require('tape')
const Mock = require('mock-fs')

const Punc = require('../')

/* MOCK FILE SYSTEM */
let aliceStub = new Buffer('-;alice,in.wonder\'land(-;-.,""')

Mock({ 'books': { 'alice.txt': aliceStub } })

/* TESTS */
Test('Punc: exists?', t => {
  t.equal(typeof Punc, 'function', 'it exists.')
  t.end()
})

Test('Punc: handles null filePath argument?', t => {
  t.throws(_ => Punc(), 'error throws.')
  t.end()
})

Test('Punc: returns a Promise?', t => {
  let module = Punc('books/alice.txt')
  t.ok(module.then, 'is then-able.')
  t.ok(module.catch, 'is catch-able.')
  t.end()
})

Test('Punc: punctuation count', t => {
  t.plan(1)
  let aliceCheatSheet = { ';': 2
    , ':': 0
    , '\'': 1
    , '"': 2
    , ',': 2
    , '!': 0
    , '?': 0
    , '.': 2
    , '(': 1
    , ')': 0
    , '-': 3
  }

  Punc('books/alice.txt')
    .then(book => {
      t.ok(book.count, 'count property exists on returns object')

      for (let key in book.count) {

        if (!aliceCheatSheet.hasOwnProperty(key)) {
          return t.fail(`Key not found: ${key}`)
        }

        if (aliceCheatSheet[key] !== book.count[key]) {
          return t.fail(`Value mismatch.\
            Expected: ${aliceCheatSheet[key]}.\
            Actual: ${book.count[key]}`)
        }
      }
      t.end()
    })
    .catch(err => t.fail())
})