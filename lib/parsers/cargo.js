'use strict';

var Toml = require("toml");

var cargo = function(str) {
  var toml;
  try { toml = Toml.parse(str); } catch(err) { return []; }
  var deps = toml.dependencies;
  return Object.keys(deps)
  .reduce(function(accum, dep) {
    accum.push([dep, deps[dep]]);
    return accum;
  }, []);
};

module.exports = cargo;
