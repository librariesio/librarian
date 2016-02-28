'use strict';

var xml = require('xml2json');

var nuget = function(str) {
  var json;
  try { json = JSON.parse(xml.toJson(str)); } catch(err) { return []; }
  var deps = json.packages.package;
  if (!Array.isArray(deps)) deps = [deps];
  return deps.reduce(function(accum, dep) {
    accum.push({
      name: dep.id,
      version: dep.version,
      type: 'runtime'
    });
    return accum;
  }, []);
};

module.exports = nuget;
