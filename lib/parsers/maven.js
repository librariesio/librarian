'use strict';

var xml = require('xml2json');

var readProp = function(json, prop) {
  if(prop && String(prop).match(/^\$\{(.+)\}/)){
    return json.project.properties[String(prop).match(/^\$\{(.+)\}/)[1]]
  } else {
    return prop
  }
}

var maven = function(str) {
  var json;
  try { json = JSON.parse(xml.toJson(str)); } catch(err) { return []; }
  if(json.project && json.project.dependencies){
    var deps = json.project.dependencies.dependency;
  } else {
    var deps = []
  }
  if (!Array.isArray(deps)) deps = [deps];
  if(json.project.dependencyManagement && json.project.dependencyManagement.dependencies){
    deps = deps.concat(json.project.dependencyManagement.dependencies.dependency)
  }
  return deps.reduce(function(accum, dep) {
    if (typeof dep === "undefined") return accum;
    accum.push({
      name: readProp(json, dep.groupId) + ":" + readProp(json, dep.artifactId),
      version: readProp(json, dep.version) || '*',
      type: readProp(json, dep.scope) || 'runtime'
    });
    return accum;
  }, []);
};

module.exports = maven;
