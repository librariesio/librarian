'use strict';

var cocoapods = function(str) {
  return str.split("\n").reduce(function(accum,line) {
    var match = line.replace(/'|"/g,'').match(/pod ([a-zA-Z-_]+)(,\s?(.+)?)?/i);
    if (match) accum.push([match[1], match[3] || '>= 0']);
    return accum;
  }, []);
};

module.exports = cocoapods;
