'use strict';

var dub = function(str) {
  var json;
  try { json = JSON.parse(str); } catch(err) { return []; }
  var deps = json.dependencies || {};
  return Object.keys(deps)
  .reduce(function(accum, dep) {
    accum.push([dep, deps[dep]]);
    return accum;
  }, []);
};

module.exports = dub;
