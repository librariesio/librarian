'use strict';

var YAML = require('js-yaml');

function parser(str) {
  var yaml;

  try { yaml = YAML.load(str); }
  catch(e) { throw new Error('Invalid YAML'); }

  var deps = [];
  var runtimeDeps = yaml.dependencies || [];
  var devDeps = yaml.development_dependencies || [];

  Object.keys(runtimeDeps).forEach( dep => {
    deps.push({
      name: dep,
      version: runtimeDeps[dep].version || '*',
      type: 'runtime'
    });
  });

  Object.keys(devDeps).forEach( dep => {
    deps.push({
      name: dep,
      version: devDeps[dep].version || '*',
      type: 'development'
    });
  });


  return deps;

}

module.exports = parser;
