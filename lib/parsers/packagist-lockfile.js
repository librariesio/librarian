'use strict';

var packagistLockfile = function(str) {
  var json;
  try { json = JSON.parse(str); } catch(err) { return []; }
  var deps = json.packages;
  if(!deps) return [[]];
  return Object.keys(deps)
  .reduce(function(accum, dep) {
    accum.push([deps[dep].name, deps[dep].version]);
    return accum;
  }, []);
};

module.exports = packagistLockfile;
