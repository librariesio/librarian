'use strict';

var xml = require('xml2json');

var nuspec = function(str) {
  var json;
  try { json = JSON.parse(xml.toJson(str)); } catch(err) { return []; }
  var deps = json.package.metadata.dependencies.dependency;
  return deps.reduce(function(accum, dep) {
    accum.push([dep.id, dep.version]);
    return accum;
  }, []);
};

module.exports = nuspec;
