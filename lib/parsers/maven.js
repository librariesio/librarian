'use strict';

var xml = require('xml2json');

var readProp = function(json, prop) {
  if(prop && prop.match(/^\$\{(.+)\}/)){
    return json.project.properties[prop.match(/^\$\{(.+)\}/)[1]]
  } else {
    return prop
  }
}

var maven = function(str) {
  var json;
  try { json = JSON.parse(xml.toJson(str)); } catch(err) { return []; }
  var deps = json.project.dependencies.dependency;
  if(json.project.dependencyManagement){
    deps = deps.concat(json.project.dependencyManagement.dependencies.dependency)
  }
  return deps.reduce(function(accum, dep) {
    accum.push({
      name: readProp(json, dep.groupId) + ":" + readProp(json, dep.artifactId),
      version: readProp(json, dep.version),
      type: readProp(json, dep.scope) || 'runtime'
    });
    return accum;
  }, []);
};

module.exports = maven;
