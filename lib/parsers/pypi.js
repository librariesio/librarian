'use strict';

var pypi = function(str) {
  var deps = str.split("\n").reduce( (accum, line) => {
    var parts = line.trim().split('==');
    if (parts.length !== 2) return accum;

    accum.push([parts[0], parts[1]]);
    return accum;
  }, []);

  return deps;
};

module.exports = pypi;
