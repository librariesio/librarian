'use strict';

var Toml = require("toml");

function parser(str) {
  var toml;

  try { toml = Toml.parse(str); }
  catch(e) { throw new Error('Invalid TOML'); }

  var deps = [];
  var runtimeDeps = toml.package || [];
  Object.keys(runtimeDeps).forEach( (dep) => {
    deps.push({
      name: runtimeDeps[dep].name,
      version: runtimeDeps[dep].version,
      type: 'runtime'
    });
  });

  return deps;
}

module.exports = parser;
