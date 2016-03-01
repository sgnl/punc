'use strict'

const Test = require('tape')
const Mock = require('mock-fs')

const Punc = require('../')

/* MOCK FILE SYSTEM */
let aliceStub = new Buffer('-;alice,in.wonder\'land(-;-.,""')

Mock({ 'books': { 'alice.txt': aliceStub } })

/* TESTS */
Test('Punc: exists?', t => {
  t.plan(1)
  t.equal(typeof Punc, 'function', 'it exists')
})

Test('Punc: handles null filePath argument?', t => {
  t.plan(1)
  t.throws(_ => Punc(), 'error throws')
})

Test('Punc: returns a Promise?', t => {
  t.plan(2)
  let module = Punc('books/alice.txt')
  t.ok(module.then, 'is then-able')
  t.ok(module.catch, 'is catch-able')
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
      t.ok(book.count, 'count property exists on returned object')
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
    })
    .catch(err => t.fail(err))
})

Test('Punc: punctuation body', t => {
  t.plan(2)
  Punc('books/alice.txt')
    .then(book => {
      t.ok(book.body, 'body property exists on returned object')
      t.equals(book.body, '-;,.\'(-;-.,""')
    })
    .catch(err => t.fail(err))
})