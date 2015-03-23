/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

var elm = function(str) {
  var deps = JSON.parse(str).dependencies;
  return Object.keys(deps)
  .reduce(function(accum, dep) {
    accum.push([dep, deps[dep]]);
    return accum;
  }, []);
};

module.exports = elm;
