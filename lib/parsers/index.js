'use strict';

var Promise = require('bluebird');

var parsers = {
  npm: {
    name: 'NPM',
    type: 'manifest',
    parser: require('./npm'),
    filter: path => path.match(/^package\.json$/)
  },
  cpanMetaYML: {
    name: 'CPAN',
    type: 'manifest',
    parser: require('./cpan-meta-yml'),
    filter: path => path.match(/^META\.yml$/)
  },
  cpanMetaJSON: {
    name: 'CPAN',
    type: 'manifest',
    parser: require('./cpan-meta-json'),
    filter: path => path.match(/^META\.json$/)
  },
  npmshrinkwrap: {
    name: 'NPM',
    type: 'lockfile',
    parser: require('./npm-shrinkwrap'),
    filter: path => path.match(/^npm-shrinkwrap\.json$/)
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
    filter: path => path.match(/^Gemfile\.lock$|^gems\.locked$/)
  },
  gemspec: {
    name: 'Rubygems',
    type: 'gemspec',
    parser: require('./gemspec'),
    filter: path => path.match(/^[A-Za-z0-9_-]+\.gemspec$/)
  },
  podspec: {
    name: 'Cocoapods',
    type: 'podspec',
    parser: require('./podspec'),
    filter: path => path.match(/^[A-Za-z0-9_-]+\.podspec$/)
  },
  nuspec: {
    name: 'Nuspec',
    type: 'manifest',
    parser: require('./nuspec'),
    filter: path => path.match(/^[A-Za-z0-9_-]+\.nuspec$/)
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
  cargo: {
    name: 'Cargo',
    type: 'manifest',
    parser: require('./cargo'),
    filter: path => path.match(/^Cargo\.toml$/)
  },
  cargolockfile: {
    name: 'Cargo',
    type: 'lockfile',
    parser: require('./cargo-lock'),
    filter: path => path.match(/^Cargo\.lock$/)
  },
  elm: {
    name: 'Elm',
    type: 'manifest',
    parser: require('./elm'),
    filter: path => path.match(/^elm-package\.json$|^elm_dependencies\.json$/)
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
  pub: {
    name: 'Pub',
    type: 'manifest',
    parser: require('./pub'),
    filter: path => path.match(/^pubspec\.yaml$/)
  },
  publock: {
    name: 'Pub',
    type: 'lockfile',
    parser: require('./publock'),
    filter: path => path.match(/^pubspec\.lock$/)
  },
  clojars: {
    name: 'Clojars',
    type: 'manifest',
    parser: require('./clojars'),
    filter: path => path.match(/^project\.clj$/)
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
    filter: path => path.match(/require.*\.(txt|pip)$/)
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
  nuget: {
    name: 'NuGet',
    type: 'manifest',
    parser: require('./nuget'),
    filter: path => path.match(/Project\.json$/)
  },
  nugetLockfile: {
    name: 'NuGet',
    type: 'lockfile',
    parser: require('./nuget-lockfile'),
    filter: path => path.match(/Project\.lock\.json$/)
  },
  nugetPackages: {
    name: 'NuGet',
    type: 'manifest',
    parser: require('./nuget-packages'),
    filter: path => path.match(/packages.config$/)
  },
  julia: {
    parser: require('./julia'),
    filter: path => path.match(/^REQUIRE$/)
  },
  meteor: {
    parser: require('./meteor'),
    filter: path => path.match(/^versions\.json$/)
  },
  go: {
    name: 'Go',
    type: 'manifest',
    parser: require('./godeps'),
    filter: path => path.match(/^Godeps\/Godeps\.json$/)
  },
  glide: {
    name: 'Go',
    type: 'manifest',
    parser: require('./glide'),
    filter: path => path.match(/^glide\.yaml$/)
  },
  glidelockfile: {
    name: 'Go',
    type: 'lockfile',
    parser: require('./glidelockfile'),
    filter: path => path.match(/^glide\.lock$/)
  },
  cartfile: {
    name: 'Carthage',
    type: 'manifest',
    parser: require('./cartfile'),
    filter: path => path.match(/^Cartfile$/)
  },
  cartfileprivate: {
    name: 'Carthage',
    type: 'manifest',
    parser: require('./cartfileprivate'),
    filter: path => path.match(/^Cartfile\.private$/)
  },
  cartfileresolved: {
    name: 'Carthage',
    type: 'lockfile',
    parser: require('./cartfileresolved'),
    filter: path => path.match(/^Cartfile\.resolved$/)
  },
  maven: {
    name: 'Maven',
    type: 'manifest',
    parser: require('./maven'),
    filter: path => path.match(/pom\.xml$/i)
  },
  ivy: {
    name: 'Maven',
    type: 'manifest',
    parser: require('./ivy'),
    filter: path => path.match(/ivy\.xml$/i)
  },
  shard: {
    name: 'Shards',
    type: 'manifest',
    parser: require('./shard'),
    filter: path => path.match(/shard\.yml$/i)
  },
  shardLockfile: {
    name: 'Shards',
    type: 'lockfile',
    parser: require('./shard-lockfile'),
    filter: path => path.match(/^shard\.lock$/i)
  }
};

var parse = function(platformName, str) {
  var platform = parsers[platformName];
  if (!platform) return Promise.reject('Invalid platform');

  return Promise.resolve(platform.parser(str));
};

var findPlatform = function(filepath) {
  var pm;
  Object.keys(parsers).some( (_pm) => {
    pm = parsers[_pm];
    pm.parserName = _pm;

    if (pm.filter(filepath)) { return true; } else { pm = null; }
  });
  return pm;
};

module.exports = {
  parse: parse,
  findPlatform: findPlatform,
  parsers: parsers
};
