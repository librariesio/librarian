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
  nuspec: {
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
    filter: path => path.match(/^requirements\.txt$/)
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
    parser: require('./nuget'),
    filter: path => path.match(/^Project\.json$/)
  },
  nugetLockfile: {
    parser: require('./nuget-lockfile'),
    filter: path => path.match(/^Project\.lock\.json$/)
  },
  julia: {
    parser: require('./julia'),
    filter: path => path.match(/^REQUIRE$/)
  },
  meteor: {
    parser: require('./meteor'),
    filter: path => path.match(/^versions\.json$/)
  },

  // DISABLED

  //dpkg: {
  //  name: 'APT',
  //  type: 'system',
  //  parser: require('./dpkg'),
  //  filter: path => path.match(/^dpkg$/)
  //}
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
