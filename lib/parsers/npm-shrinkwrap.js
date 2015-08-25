'use strict';

var npm = function(str) {
  var json;
  try { json = JSON.parse(str); } catch(err) { return []; }

  var _deps = json.dependencies;
  var deps = Object.keys(_deps).reduce( (accum, key) => {
    accum.push([key, _deps[key].version]);
    return accum;
  }, []);

  return deps;
};

module.exports = npm;
