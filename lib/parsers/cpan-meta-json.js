'use strict';

function parser(str) {
  var json;

  try { json = JSON.parse(str); }
  catch(e) { throw new Error('Invalid JSON'); }

  var deps = [];
  var runtimeDeps = json.prereqs || [];

  Object.keys(runtimeDeps).forEach( group => {
    Object.keys(runtimeDeps[group].requires).forEach( dep => {
      deps.push({
        name: dep,
        version: `>= ${runtimeDeps[group].requires[dep]}`,
        type: group
      });
    });
  });

  return deps;
}

module.exports = parser;
