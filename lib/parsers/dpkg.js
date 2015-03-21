/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

module.exports = function(str) {
  return str.split("\n").reduce(function(accum,line) {
    if (!line.match(/^ii/)) return accum;

    var match = line.split(/\s+/g);
    if (match) accum.push([match[1], match[2] || 'latest']);
    return accum;
  }, []);
};
