'use strict';

function parser(str) {
  return str.split("\n").reduce(function(accum,line) {

    var match = line.split(/\s/);
    if (match[0].length > 0) {
      accum.push({
        name: match[0],
        version: match[1] || '>= 0',
        type: 'runtime'
      });
    }

    return accum;
  }, []);
}

module.exports = parser;
