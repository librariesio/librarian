'use strict';

var rp = require('request-promise');

function parser(str) {
  var options = {
    uri :     'https://mix-deps-json.herokuapp.com/',
    method :  'POST',
    body:     str
  };

  return rp(options)
  .then( (res) => {
    var dependencies;

    try { dependencies = JSON.parse(res); }
    catch(err) { return []; }

    return Object.keys(dependencies)
    .reduce(function(accum, pkg) {

      accum.push({
        name: pkg,
        version: dependencies[pkg],
        type: 'runtime'
      });

      return accum;
    }, []);
  });
}

module.exports = parser;
