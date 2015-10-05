'use strict';

var yaml = require('js-yaml');

var cpanMetaYML = function(str) {
  var deps = yaml.load(str).requires || {};
  return Object.keys(deps)
  .reduce(function(accum, dep) {
    accum.push([dep, ">= " + deps[dep]]);
    return accum;
  }, []);
};

module.exports = cpanMetaYML;
