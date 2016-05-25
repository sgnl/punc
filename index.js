
'use strict'

/* core */
const Promise   = require('bluebird');
const Through2  = require('through2');
const ReadFile  = require('fs').createReadStream;
const ForEach   = [].forEach;

/* addons */
const PDFkit = require('pdfkit');
const WriteFile = require('fs').createWriteStream;

/* MODULE */
function Punc(filePath, options){
  if (!filePath) throw new Error('Punc: file path not given.');
  if (!options) {
    options = { encoding: 'utf8' };
  } else if (typeof options === 'string') {
    options = { encoding: options };
  } else if (typeof options !== 'object') {
    throw new TypeError(`Punc: expected options to be either
      an object or a string, but got ${typeof options} instead`
    );
  }

  let punctuationStore = [];
  let wordsPerSent = 0;
  let spacedOutBody = '';
  let dict = { ';': 0
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
  };

  return new Promise((resolve, reject) => {
    ReadFile(filePath, options.encoding)
      .pipe(removeAndReplace(/[\r\n]/g, ''))
      .pipe(removeAndReplace(/[\s]+/g, ' '))
      .pipe(findAndCount(dict, punctuationStore))
      .pipe(findWordsPerSentence(count => wordsPerSent = count))
      .pipe(removeAndReplace(/[a-zA-Z\d]+/g, ' ', spaced => spacedOutBody = spaced))
      .on('data', _ => _)
      .on('end', _ => {
        return resolve({ body: punctuationStore.join('')
        , count: dict
        , wordsPerSentence: wordsPerSent
        , spaced: spacedOutBody
        });
      })
      .on('error', error => reject(error))
    ;
  });
}

/* core helper */

function removeAndReplace (regex, replace, dest) {
  return Through2.obj(function(chunk, _, callback) {
    chunk = chunk.replace(regex, replace);

    if (dest) dest(chunk);

    callback(null, chunk);
  });
}

function findWordsPerSentence (changeCount) {
  return Through2.obj(function(chunk, _, callback) {
    let periodCount = (chunk.match(/\.|\?|\!/g) || []).length;
    let wordCount = chunk.split(' ').length;

    changeCount(wordCount / periodCount);
    callback(null, chunk);
  });
}

function findAndCount (map, dest) {
  return Through2.obj(function(chunk, _, callback) {
    ForEach.call(chunk, punctuation => {
      if ( punctuation in map ) {
        map[ punctuation ]++;
        dest.push(punctuation);
      }
    });
    callback(null, chunk);
  });
}

/* additional methods */
Punc.createPDF = (filePath, options) => {
  if (!filePath) throw new Error('Punc.createPDF: file path not given.');
  if (!options) {
    options = { encoding: 'utf8' };
  } else if (typeof options === 'string') {
    options = { encoding: options };
  } else if (typeof options !== 'object') {
    throw new TypeError(`Punc.createPDF: expected options to be either
      an object or a string, but got ${typeof options} instead`
    );
  }

  return new Promise((resolve, reject) => {
    ReadFile(filePath, options.encoding)
      .pipe(removeAndReplace(/[a-zA-Z\d]+/g, ' '))
      .on('data', data => {
        let pdf = new PDFkit();
        let newFileName = `${ filePath }-visual.pdf`;

        pdf.pipe(WriteFile(newFileName));

        pdf
          .font('lib/fonts/Inconsolata-Regular.ttf')
          .fontSize(25)
          .text(data)
        ;

        pdf.end();

        resolve({success: true, pathToFile: newFileName });
      })
      .on('end', _ => _)
      .on('error', error => reject(error))
    ;
  });
}

/* THE TRUTH IS OUT THERE */
module.exports = Punc;
