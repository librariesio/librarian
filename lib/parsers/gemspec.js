'use strict';

var rp = require('request-promise');

function parser(str) {
  var options = {
    uri :     'https://gemparser.herokuapp.com/gemspec',
    method :  'POST',
    formData: {body: str},
    json:     true
  };

  return rp(options)
  .then( (dependencies) => {
    dependencies = dependencies.constructor === Array ? dependencies : [];

    return dependencies.reduce( (accum, dep) => {
      accum.push({
        name: dep.name,
        version: dep.version,
        type: dep.type
      });
      return accum;
    }, []);
  });

}

module.exports = parser;
