/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

module.exports = {
  cargo: require('./cargo'),
  npm: require('./npm'),
  bower: require('./bower'),
  pub: require('./pub'),
  rubygems: require('./rubygems'),
  packagist: require('./packagist'),
  cocoapods: require('./cocoapods'),
  dpkg: require('./dpkg')
};
