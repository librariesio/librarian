'use strict';

var npm = function(str) {
  var json;

  try { json = JSON.parse(str); }
  catch(e) { throw new Error('Invalid JSON'); }

  var deps = [];

  Object.keys(json.dependencies).forEach( (dep) => {
    deps.push({
      name: dep,
      version: json.dependencies[dep].version,
      type: 'runtime'
    });
  });

  return deps;
};

module.exports = npm;
