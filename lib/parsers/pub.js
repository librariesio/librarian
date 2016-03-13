'use strict';

var YAML = require('js-yaml');

function parser(str) {
  var yaml;

  try { yaml = YAML.load(str); }
  catch(e) { throw new Error('Invalid YAML'); }

  var deps = [];
  var runtimeDeps = yaml.dependencies || [];
  var devDeps = yaml.dev_dependencies || [];


  Object.keys(runtimeDeps).forEach( (dep) => {
    deps.push({
      name: dep,
      version: runtimeDeps[dep],
      type: 'runtime'
    });
  });

  Object.keys(devDeps).forEach( (dep) => {
    deps.push({
      name: dep,
      version: devDeps[dep],
      type: 'development'
    });

  });

  return deps;
}

module.exports = parser;
