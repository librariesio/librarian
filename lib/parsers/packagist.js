/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

var packagist = function(str) {
  var deps = JSON.parse(str).require;
  if(!deps) return [[]];
  return Object.keys(deps)
  .reduce(function(accum, dep) {
    accum.push([dep, deps[dep]]);
    return accum;
  }, []);
};

module.exports = packagist;
