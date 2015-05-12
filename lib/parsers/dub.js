'use strict';

var dub = function(str) {
  var deps = JSON.parse(str).dependencies;
  return Object.keys(deps)
  .reduce(function(accum, dep) {
    accum.push([dep, deps[dep]]);
    return accum;
  }, []);
};

module.exports = dub;
