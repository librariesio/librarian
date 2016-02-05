'use strict';

function parser(str) {
  var json;

  try { json = JSON.parse(str); }
  catch(e) { throw new Error('Invalid JSON'); }

  var deps = [];
  var runtimeDeps = json.Deps || [];

  Object.keys(runtimeDeps).forEach( (dep) => {
    deps.push({
      name: runtimeDeps[dep].ImportPath,
      version: runtimeDeps[dep].Rev,
      type: 'runtime'
    });
  });

  return deps;
}

module.exports = parser;
