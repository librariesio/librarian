'use strict';

var julia = function(str) {
  return str.split("\n").reduce(function(accum,line) {

    var match = line.split(/\s/);
    if (match[0].length > 0) accum.push([match[0], match[1] || '>= 0']);
    return accum;
  }, []);
};

module.exports = julia;
