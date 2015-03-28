/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

var platforms = {
  cargo:      require('./cargo'),
  npm:        require('./npm'),
  bower:      require('./bower'),
  dub:        require('./dub'),
  elm:        require('./elm'),
  pub:        require('./pub'),
  rubygems:   require('./rubygems'),
  packagist:  require('./packagist'),
  cocoapods:  require('./cocoapods'),
  dpkg:       require('./dpkg'),
  mix:        require('./mix')
};

var parse = function(platform, str) {
  return new Promise(function(resolve, reject) {
    if (!platforms[platform]) return reject('Invalid platform');
    resolve(platforms[platform](str));
  });
};

module.exports = {
  parse: parse
};
