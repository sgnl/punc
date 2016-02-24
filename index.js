'use strict';

function PuncModule (opts) {
  let _filePath, module = {};
 
  module.load = (filePath) => {
    _filePath = filePath;

    return 'file path accepted';
  };

  return module;
}

module.exports = PuncModule;

