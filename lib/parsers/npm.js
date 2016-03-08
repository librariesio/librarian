'use strict';

function parser(str) {
  var json;

  try { json = JSON.parse(str); }
  catch(e) { throw new Error('Invalid JSON'); }

  var deps = [];
  var runtimeDeps = json.dependencies || [];
  var devDeps = json.devDependencies || [];
  var optionalDeps = json.optionalDependencies || [];
  var peerDeps = json.peerDependencies || [];

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

  Object.keys(optionalDeps).forEach( (dep) => {
    deps.push({
      name: dep,
      version: optionalDeps[dep],
      type: 'optional'
    });
  });

  Object.keys(peerDeps).forEach( (dep) => {
    deps.push({
      name: dep,
      version: peerDeps[dep],
      type: 'peer'
    });
  });

  return deps;
}

module.exports = parser;
