'use strict';

const Test = require('tape');
const ReadFile = require('fs').readFile;

const Punc = require('../');

/* TESTS */
Test('Punc: exists?', t => {
  t.plan(1);
  t.equal(typeof Punc, 'function', 'it exists');
});

Test('Punc: handles null filePath argument?', t => {
  t.plan(1);
  t.throws(_ => Punc(), 'error throws');
});

Test('Punc: returns a Promise?', t => {
  t.plan(2);
  let module = Punc('tests/books/alice.txt');
  t.ok(module.then, 'is then-able');
  t.ok(module.catch, 'is catch-able');
});

Test('Punc: punctuation count', t => {
  t.plan(1);
  let punctuationMap = { ';': 2
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
  };

  return Punc('tests/books/alice.txt')
    .then(book => {
      t.ok(book.count, 'count property exists on returned object');

      for (let key in book.count) {

        if (!punctuationMap.hasOwnProperty(key)) {
          return t.fail(`Key not found: ${key}`);
        }

        if (punctuationMap[key] !== book.count[key]) {
          return t.fail(`Value mismatch.\n\
            Punctuation: ${key}\n\
            Expected: ${punctuationMap[key]}.\n\
            Actual: ${book.count[key]}`
          );
        }
      }
    })
    .catch(err => t.fail(err));
});

Test('Punc: punctuation body', t => {
  t.plan(2);

  return Punc('tests/books/alice.txt')
    .then(book => {
      t.ok(book.body, 'body property exists on returned object');
      t.equals(book.body, '-;,.\'(-;-.,""');
    })
    .catch(err => t.fail(err));
});

Test('Punc: words per sentence', t => {
  t.plan(2);

  return Punc('tests/books/word_count.txt')
    .then(book => {
      t.ok(book.wordsPerSentence, 'wordCount property exists on returned object');
      t.equals(book.wordsPerSentence, 2.5);
    })
    .catch(err => t.fail(err));
});

Test('Punc: spaced out text', t => {
  t.plan(2);

  return Punc('tests/books/word_count.txt')
    .then(book => {
      t.ok(book.spaced, 'spaced property exists on returned object');
      t.equals(book.spaced, ' .    !      ?        .');
    })
    .catch(err => t.fail(err));
})

Test('Punc.createPDF: method exists?', t => {
  t.equals(typeof Punc.createPDF, 'function', 'createPDF method exists.');
  t.end();
})

Test('Punc.createPDF: handles null filePath argument?', t => {
  t.plan(1);
  t.throws(_ => Punc.createPDF(), 'error throws');
});

Test('Punc.createPDF: creates PDF file', t => {
  t.plan(2);

  let filePath = 'tests/books/dream_speech';

  Punc.createPDF(filePath)
    .then(success => {
      t.pass('Punc returns success message');

      return ReadFile(filePath, (err, data) => {
        if (err) return reject(err);
        if (data) return t.pass('pdf file exists');
      });
    })
    .catch(err => t.fail(err));
})
