'use strict';

var ini = require('ini');

var platformio = function(str) {
  // lib_install or install_libs

  var deps = ini.parse(str).install_libs || '';
  var libs = deps.split(',')
  return libs
  .reduce(function(accum, dep) {
    accum.push([dep, deps[dep] || '>= 0' ]);
    return accum;
  }, []);
};

module.exports = platformio;
