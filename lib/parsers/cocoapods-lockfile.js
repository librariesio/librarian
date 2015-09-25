'use strict';

var yaml = require('js-yaml');

var cocoapodsLockfile = function(str) {
  var deps = yaml.load(str).PODS || [];
  return Object.keys(deps)
  .reduce(function(accum, dep) {
    var depStr = deps[dep];
    if (typeof(deps[dep]) == 'object') depStr = Object.keys(deps[dep])[0];
    var match = depStr.match(/(.+?)\s\((.+?)\)/i);
    if(match) accum.push([match[1], match[2]]);
    return accum;
  }, []);
};

module.exports = cocoapodsLockfile;
