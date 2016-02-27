# Punc
Read a file, remove the words, see all the punctuations

![image](https://cloud.githubusercontent.com/assets/3915598/13369726/783be3d0-dc9c-11e5-846a-5f1ec6517966.png)

Ever wonder what your favorite books look like without words?

## Installation
`npm install punc`

## Example Usage

```javascript
'use strict'

const Punc = require('./index')

Punc('alice.txt', 'utf8')
  .then(book => {
    console.log(book.count)
    console.log(book.body)
  })
  .catch(error => {
    console.log(error)
  })

```
Output found: [here][EXAMPLE_OUTPUT]

## Documentation
Please see the [wiki][WIKI].

## Notes
  - Punctuations to keep when removing words:

    `; : ' " , ! ? . ( ) -`

  - Punctuations to use when counting occurances:

    `; : ' " , ! ? .`

## Inspiration
*inspired by [this article][1] on medium which was in-turn inspired by [this article][2]*

## License
[MIT][LICENSE]

<!-- urls -->

[1]: https://medium.com/@neuroecology/punctuation-in-novels-8f316d542ec4#.6e7lvvwp8

[2]: http://www.c82.net/work/?id=347

[WIKI]: https://github.com/sgnl/punc/wiki/Usage

[EXAMPLE_OUTPUT]: https://gist.github.com/sgnl/cce4382fd9302515e838

[LICENSE]: https://github.com/sgnl/punc/blob/master/LICENSE

