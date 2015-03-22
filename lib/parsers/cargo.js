/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

var toml = require("toml");

var cargo = function(str) {
  var deps = toml.parse(str).dependencies;
  return Object.keys(deps)
  .reduce(function(accum, dep) {
    accum.push([dep, deps[dep]]);
    return accum;
  }, []);
};

module.exports = cargo;
