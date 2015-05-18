'use strict';

var bower = function(str) {
  var json;
  try { json = JSON.parse(str); } catch(err) { return []; }
  var allDeps = Object.assign({}, json.dependencies, json.devDependencies);
  return Object.keys(allDeps)
  .reduce(function(accum, dep) {
    accum.push([dep, allDeps[dep]]);
    return accum;
  }, []);
};

module.exports = bower;
