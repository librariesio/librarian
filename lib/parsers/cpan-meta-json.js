'use strict';

var cpanMetaJSON = function(str) {
  var deps = JSON.parse(str).prereqs || {};
  return Object.keys(deps)
  .reduce(function(accum, group) {
    Object.keys(deps[group].requires)
      .reduce(function(groupAccum, dep) {
        accum.push([dep, ">= " + deps[group].requires[dep]]);
      }, []);
    return accum;
  }, []);
};

module.exports = cpanMetaJSON;
