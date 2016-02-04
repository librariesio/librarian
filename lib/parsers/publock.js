'use strict';

var YAML = require('js-yaml');

function parser(str) {
  var yaml;

  try { yaml = YAML.load(str); }
  catch(e) { throw new Error('Invalid YAML'); }

  var deps = [];
  var runtimeDeps = yaml.packages || [];

  Object.keys(runtimeDeps).forEach( (dep) => {
    deps.push({
      name: dep,
      version: runtimeDeps[dep].version,
      type: 'runtime'
    });
  });

  return deps;
}

module.exports = parser;
