'use strict';

var rp = require('request-promise');

function parser(str) {
  var options = {
    uri :     'http://clojars-json.herokuapp.com/project.clj',
    method :  'POST',
    body:     str
  };

  return rp(options)
  .then( (proj) => {
    var proj = JSON.parse(proj)
    var index = proj.indexOf("dependencies");

    if (index < 0) return [];

    var dependencies = proj[index + 1];
    return dependencies.reduce( (accum, dep) => {
      accum.push({
        name: dep[0],
        version: dep[1],
        type: "runtime"
      });
      return accum;
    }, []);
  });
}

module.exports = parser;
