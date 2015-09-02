'use strict';

var REGEXP = /^([a-zA-Z0-9-_\.]+)[=|>|<]=(\d+(\.\d+)?(\.\d+)?)/;

var pypi = function(str) {
  var deps = str.split("\n").reduce( (accum, line) => {
    var match = line.match(REGEXP);

    if (!match) return accum;

    let [_, name, version] = match;
    accum.push([name, version]);
    return accum;
  }, []);

  return deps;
};

module.exports = pypi;
