/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

var npm = function(str) {
  var json;
  try { json = JSON.parse(str); } catch(err) { return []; }
  var allDeps = Object.assign({}, json.dependencies, json.devDependencies);
  return Object.keys(allDeps)
  .reduce(function(accum, dep) {
    accum.push([dep, allDeps[dep]]);
    return accum;
  }, []);
};

module.exports = npm;
