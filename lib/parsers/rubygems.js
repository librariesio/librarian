/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

require("babel/register");

var rubygems = function(str) {
  return str.split("\n").reduce(function(accum,line) {
    var match = line.replace(/'|"/g,'').match(/gem (.+)/i);
    if (!match) return accum;

    var parts = match[1].split(',').map( p => p.trim() );
    if (match) accum.push([parts[0], parts[1] || '>= 0']);
    return accum;
  }, []);
};

module.exports = rubygems;
