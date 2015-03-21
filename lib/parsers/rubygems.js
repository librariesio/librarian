/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

var rubygems = function(str) {
  return str.split("\n").reduce(function(accum,line) {
    var match = line.replace(/'|"/g,'').match(/gem ([a-zA-Z-_]+)(,\s?(.+)?)?/i);
    if (match) accum.push([match[1], match[3] || 'latest']);
    return accum;
  }, []);
};

module.exports = rubygems;
