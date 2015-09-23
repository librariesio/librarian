'use strict';

var xml = require('xml2json');

var maven = function(str) {
  var json;
  try { json = JSON.parse(xml.toJson(str)); } catch(err) { return []; }
  var deps = json.project.dependencyManagement.dependencies.dependency;
  return deps.reduce(function(accum, dep) {
    accum.push([dep.groupId + '/' + dep.artifactId, dep.version]);
    return accum;
  }, []);
};

module.exports = maven;
