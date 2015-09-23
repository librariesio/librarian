'use strict';

var ini = require('ini');

var nimble = function(str) {
  var deps = ini.parse(str).Deps || {};
  return Object.keys(deps)
  .reduce(function(accum, dep) {
    accum.push([dep, deps[dep]]);
    return accum;
  }, []);
};

module.exports = nimble;
