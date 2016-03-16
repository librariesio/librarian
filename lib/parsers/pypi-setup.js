'use strict';

var INSTALL_REGEXP = /install_requires?\s*=\s*\[(.*)\]/mi
var REGEXP = /["']([a-zA-Z0-9-_\.]+)\s*[=|>|<]=\s*(\d+(\.\d+)?(\.\d+)?)["']/mi;

function parser(str) {
  var install_match = str.match(INSTALL_REGEXP);

  if (!install_match) return [];

  var deps = install_match.split(",").reduce( (accum, line) => {
    var match = line.match(REGEXP);

    if (!match) return accum;

    let [_, name, version] = match;

    accum.push({
      name: name,
      version: version,
      type: 'runtime'
    });

    return accum;
  }, []);

  return deps;
}

module.exports = parser;
