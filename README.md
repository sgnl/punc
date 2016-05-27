# Punc
Read a file, remove the words, see all the punctuations.

![image](https://cloud.githubusercontent.com/assets/3915598/13369726/783be3d0-dc9c-11e5-846a-5f1ec6517966.png)

[![npm](https://img.shields.io/npm/v/punc.svg?style=flat-square)](https://badge.fury.io/js/punc)
[![Travis](https://img.shields.io/travis/sgnl/punc.svg?style=flat-square)](https://travis-ci.org/sgnl/punc)
[![Coverage Status](https://coveralls.io/repos/github/sgnl/punc/badge.svg?branch=master)](https://coveralls.io/github/sgnl/punc?branch=master)

## Installation

```bash

npm install punc

```

## Example Usage #1

```javascript

'use strict'

const Punc = require('./index')

Punc('alice.txt', 'utf8')
  .then(dataFromPunc => console.log(dataFromPunc))
  .catch(error => handleError(error))

```

Output found: [here][EXAMPLE_OUTPUT]

## Documentation
Please see the [wiki][WIKI].

### Features
  1. Read a file, remove words and numbers, do something with the `data`:
     - `data.count`: keeps count of every punctuation seen
     - `data.body`: complete text with letters and numbers replaced with a space-character
     - `data.wordCount`: calculates the words per sentence average
  1. Generate a PDF file. See how it would look like on e-paper

## Notes
  - Punctuations to keep when removing words:

    `; : ' " , ! ? . ( ) -`

  - Punctuations to use when counting occurances:

    `; : ' " , ! ? .`

## Inspiration
[this article][1] on medium which was in-turn inspired by [this person's work.][2]

## License
[MIT][LICENSE]

## Technical dependencies
- Node platform version: `>5.0.0`
- Promises with [Bluebird][Bluebird]: `bluebird ^3.3.1`
- Stream helper with [Through2][Through2]: `through2 ^2.0.1`

<!-- urls -->

[1]: https://medium.com/@neuroecology/punctuation-in-novels-8f316d542ec4#.6e7lvvwp8

[2]: http://www.c82.net/work/?id=347

[WIKI]: https://github.com/sgnl/punc/wiki/Usage

[EXAMPLE_OUTPUT]: https://gist.github.com/sgnl/cce4382fd9302515e838

[LICENSE]: https://github.com/sgnl/punc/blob/master/LICENSE

[Bluebird]: https://github.com/petkaantonov/bluebird/

[Through2]: https://github.com/rvagg/through2

