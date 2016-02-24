'use strict';

const Fs = require('fs');

function PuncModule (opts) {
  let _filePath, module = {};
 
  module.load = (filePath) => {
    _filePath = filePath;

    return 'file path accepted';
  };

  module.parse = () => {
    return 'parsing file';
  };

  return module;
}

module.exports = PuncModule;

