'use strict';

var rp = require('request-promise');

var hex = function(str) {
  var options = {
    uri :     'https://mix-deps-json.herokuapp.com/',
    method :  'POST',
    body:     str
  };

  return rp(options)
  .then( (res) => {
    let packages;
    try { packages = JSON.parse(res); } catch(err) { return []; }

    return Object.keys(packages)
    .reduce(function(accum, pkg) {
      accum.push([pkg, packages[pkg]]);
      return accum;
    }, []);
  });
};

module.exports = hex;