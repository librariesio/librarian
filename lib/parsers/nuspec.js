'use strict';

var xml = require('xml2json');

var nuspec = function(str) {
  var json;
  try { json = JSON.parse(xml.toJson(str)); } catch(err) { return []; }
  var deps = json.package.metadata.dependencies.dependency;
  if (!Array.isArray(deps)) deps = [deps];
  return deps.reduce(function(accum, dep) {
    if (typeof dep === "undefined") return accum;
    accum.push({
      name: dep.id,
      version: dep.version,
      type: 'runtime'
    });
    return accum;
  }, []);
};

module.exports = nuspec;
