'use strict';

var packagist = function(str) {
  var json;
  try { json = JSON.parse(str); } catch(err) { return []; }
  var deps = json.require;
  if(!deps) return [[]];
  return Object.keys(deps)
  .reduce(function(accum, dep) {
    accum.push([dep, deps[dep]]);
    return accum;
  }, []);
};

module.exports = packagist;
