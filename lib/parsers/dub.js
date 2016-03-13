'use strict';

function parser(str) {
  var json;

  try { json = JSON.parse(str); }
  catch(e) { throw new Error('Invalid JSON'); }

  var deps = [];
  var runtimeDeps = json.dependencies || [];

  Object.keys(runtimeDeps).forEach( (dep) => {
    var version, type;

    if (typeof runtimeDeps[dep] === 'string') {
      version = runtimeDeps[dep];
      type = 'runtime';
    } else {
      version = runtimeDeps[dep].version;
      type = runtimeDeps[dep].optional ? 'optional' : 'runtime';
    }

    deps.push({
      name: dep,
      version: version,
      type: type
    });
  });

  return deps;
}

module.exports = parser;
