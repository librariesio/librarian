/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

module.exports = {
  npm: require('./npm'),
  bower: require('./bower'),
  pub: require('./pub'),
  rubygems: require('./rubygems'),
  packagist: require('./packagist'),
  dpkg: require('./dpkg')
};
