'use strict';

var meteor = function(str) {
  var deps = JSON.parse(str).dependencies;
  return deps
  .reduce(function(accum, dep) {
    accum.push([dep[0], dep[1]]);
    return accum;
  }, []);
};

module.exports = meteor;
