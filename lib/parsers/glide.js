'use strict';

var YAML = require('js-yaml');

function parser(str) {
  var yaml;

  try { yaml = YAML.load(str); }
  catch(e) { throw new Error('Invalid YAML'); }

  var deps = [];
  var runtimeDeps = yaml.import || [];
  var devDeps = yaml.devImports || [];

  Object.keys(runtimeDeps).forEach( dep => {
    deps.push({
      name: runtimeDeps[dep].package,
      version: runtimeDeps[dep].version || '>= 0',
      type: 'runtime'
    });
  });

  Object.keys(devDeps).forEach( dep => {
    deps.push({
      name: devDeps[dep].package,
      version: devDeps[dep].version || '>= 0',
      type: 'development'
    });
  });

  return deps;

}

module.exports = parser;
