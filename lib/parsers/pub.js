'use strict';

var yaml = require('js-yaml');

var pub = function(str) {
  var deps = yaml.load(str).dependencies;
  return Object.keys(deps)
  .reduce(function(accum, dep) {
    accum.push([dep, deps[dep]]);
    return accum;
  }, []);
};

module.exports = pub;
