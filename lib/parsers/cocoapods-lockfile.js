'use strict';

var YAML = require('js-yaml');

function parser(str) {
  var yaml;

  try { yaml = YAML.load(str); }
  catch(e) { throw new Error('Invalid YAML'); }

  var deps = yaml.PODS || {};

  return Object.keys(deps)
  .reduce(function(accum, dep) {
    var depStr = deps[dep];

    if (typeof(deps[dep]) == 'object') depStr = Object.keys(deps[dep])[0];
    var match = depStr.match(/(.+?)\s\((.+?)\)/i);

    if (match) {
      accum.push({
        name: match[1],
        version: match[2],
        type: 'runtime'
      });
    }

    return accum;
  }, []);
}

module.exports = parser;
