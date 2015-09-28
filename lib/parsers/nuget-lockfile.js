'use strict';

var nugetLockfile = function(str) {
  var json;
  try { json = JSON.parse(str); } catch(err) { return []; }
  var deps = json.libraries;
  return Object.keys(deps)
  .reduce(function(accum, dep) {
    var match = dep.split('/');
    accum.push([match[0], match[1]]);
    return accum;
  }, []);
};

module.exports = nugetLockfile;
