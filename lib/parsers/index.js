'use strict';

var Promise = require('bluebird');

var platforms = {
  npm: {
    name: 'NPM',
    type: 'manifest',
    parser: require('./npm'),
    filter: path => path.match(/^package\.json$/)
  },
  npmshrinkwrap: {
    name: 'NPM',
    type: 'lockfile',
    parser: require('./npm-shrinkwrap'),
    filter: path => path.match(/^npm-shrinkwrap\.json$/)
  },
  cargo: {
    name: 'Cargo',
    type: 'manifest',
    parser: require('./cargo'),
    filter: path => path.match(/^Cargo\.toml$/)
  },
  bower: {
    name: 'Bower',
    type: 'manifest',
    parser: require('./bower'),
    filter: path => path.match(/^bower\.json$/)
  },
  dub:{
    name: 'Dub',
    type: 'manifest',
    parser: require('./dub'),
    filter: path => path.match(/^dub\.json$/)
  },
  elm: {
    name: 'Elm',
    type: 'manifest',
    parser: require('./elm'),
    filter: path => path.match(/^elm-package\.json$|^elm_dependencies\.json$/)
  },
  pub: {
    name: 'Pub',
    type: 'manifest',
    parser: require('./pub'),
    filter: path => path.match(/^pubspec\.yaml$/)
  },
  rubygems: {
    name: 'Rubygems',
    type: 'manifest',
    parser: require('./rubygems'),
    filter: path => path.match(/^Gemfile$|^gems\.rb$/)
  },
  rubygemslockfile: {
    name: 'Rubygems',
    type: 'lockfile',
    parser: require('./rubygems-lockfile'),
    filter: path => path.match(/^Gemfile\.lock$/)
  },
  gemspec: {
    name: 'Rubygems',
    type: 'gemspec',
    parser: require('./gemspec'),
    filter: path => path.match(/^[A-Za-z0-9_-]+\.gemspec$/)
  },
  packagist: {
    name: 'Packagist',
    type: 'manifest',
    parser: require('./packagist'),
    filter: path => path.match(/^composer\.json$/)
  },
  packagistlockfile: {
    name: 'Packagist',
    type: 'lockfile',
    parser: require('./packagist-lockfile'),
    filter: path => path.match(/^composer\.lock$/)
  },
  cocoapods: {
    name: 'CocoaPods',
    type: 'manifest',
    parser: require('./cocoapods'),
    filter: path => path.match(/^Podfile$/)
  },
  cocoapodsLockfile: {
    name: 'CocoaPods',
    type: 'lockfile',
    parser: require('./cocoapods-lockfile'),
    filter: path => path.match(/^Podfile\.lock$/)
  },
  hex: {
    name: 'Hex',
    type: 'manifest',
    parser: require('./hex'),
    filter: path => path.match(/^mix\.exs$/)
  },
  pypi: {
    name: 'PyPI',
    type: 'manifest',
    parser: require('./pypi'),
    filter: path => path.match(/^requirements\.txt$/)
  },
  dpkg: {
    name: 'APT',
    type: 'system',
    parser: require('./dpkg'),
    filter: path => path.match(/^dpkg$/)
  }
};

var parse = function(platformName, str) {
  var platform = platforms[platformName];
  if (!platform) return Promise.reject('Invalid platform');

  return Promise.resolve(platform.parser(str));
};

var findPlatform = function(filepath) {
  var pm;
  Object.keys(platforms).some( (_pm) => {
    pm = platforms[_pm];
    if (pm.filter(filepath)) { return true; } else { pm = null; }
  });
  return pm;
};

module.exports = {
  parse: parse,
  findPlatform: findPlatform
};
