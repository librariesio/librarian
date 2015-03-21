/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

module.exports = {
  cargo: require('./cargo'),
  npm: require('./npm'),
  bower: require('./bower'),
  rubygems: require('./rubygems'),
  packagist: require('./packagist'),
  dpkg: require('./dpkg')
};
