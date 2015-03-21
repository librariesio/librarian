/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

module.exports = {
  npm: require('./npm'),
  bower: require('./bower'),
  rubygems: require('./rubygems'),
  packagist: require('./packagist'),
  cocoapods: require('./cocoapods'),
  dpkg: require('./dpkg')
};
