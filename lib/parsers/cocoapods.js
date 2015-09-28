'use strict';

var rp = require('request-promise');

var cocoapods = function(str) {
  var options = {
    uri :     'https://gemparser.herokuapp.com/podfile',
    method :  'POST',
    formData: {body: str}
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

module.exports = cocoapods;
