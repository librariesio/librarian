'use strict';

var xml = require('xml2json');

var ivy = function(str) {
  var json;
  try { json = JSON.parse(xml.toJson(str)); } catch(err) { return []; }
  var deps = json['ivy-module'].dependencies.dependency;
  if (!Array.isArray(deps)) deps = [deps];
  return deps.reduce(function(accum, dep) {
    accum.push({
      name: dep.org + ":" + dep.name,
      version: dep.rev,
      type: 'runtime'
    });
    return accum;
  }, []);
};

module.exports = ivy;
