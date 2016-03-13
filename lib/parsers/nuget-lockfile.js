'use strict';

function parser(str) {
  var json;

  try { json = JSON.parse(str); }
  catch(e) { throw new Error('Invalid JSON'); }

  var deps = [];
  var runtimeDeps = json.libraries || [];

  Object.keys(runtimeDeps).forEach( (dep) => {
    var match = dep.split('/');

    deps.push({
      name: match[0],
      version: match[1],
      type: 'runtime'
    });
  });

  return deps;
}

module.exports = parser;
