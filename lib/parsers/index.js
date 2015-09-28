'use strict';

var platforms = {
  cargo: {
    parser: require('./cargo'),
    filter: path => path.match(/^Cargo\.toml$/)
  },
  npm: {
    parser: require('./npm'),
    filter: path => path.match(/^package\.json$/)
  },
  npmshrinkwrap: {
    parser: require('./npm-shrinkwrap'),
    filter: path => path.match(/^npm-shrinkwrap\.json$/)
  },
  bower: {
    parser: require('./bower'),
    filter: path => path.match(/^bower\.json$/)
  },
  dub:{
    parser: require('./dub'),
    filter: path => path.match(/^dub\.json$/)
  },
  elm: {
    parser: require('./elm'),
    filter: path => path.match(/^elm-package\.json$|^elm_dependencies\.json$/)
  },
  pub: {
    parser: require('./pub'),
    filter: path => path.match(/^pubspec\.yaml$/)
  },
  julia: {
    parser: require('./julia'),
    filter: path => path.match(/^REQUIRE$/)
  },
  rubygems: {
    parser: require('./rubygems'),
    filter: path => path.match(/^Gemfile$|^gems\.rb$/)
  },
  rubygemslockfile: {
    parser: require('./rubygems-lockfile'),
    filter: path => path.match(/^Gemfile\.lock$|^gems\.locked$/)
  },
  gemspec: {
    parser: require('./gemspec'),
    filter: path => path.match(/^[A-Za-z0-9_-]+\.gemspec$/)
  },
  packagist: {
    parser: require('./packagist'),
    filter: path => path.match(/^composer\.json$/)
  },
  packagistlockfile: {
    parser: require('./packagist-lockfile'),
    filter: path => path.match(/^composer\.lock$/)
  },
  cocoapods: {
    parser: require('./cocoapods'),
    filter: path => path.match(/^Podfile$/)
  },
  cocoapodsLockfile: {
    parser: require('./cocoapods-lockfile'),
    filter: path => path.match(/^Podfile\.lock$/)
  },
  dpkg: {
    parser: require('./dpkg'),
    filter: path => path.match(/^dpkg$/)
  },
  hex: {
    parser: require('./hex'),
    filter: path => path.match(/^mix\.exs$/)
  },
  pypi: {
    parser: require('./pypi'),
    filter: path => path.match(/^requirements\.txt$/)
  }
};

var parse = function(platform, str) {
  return new Promise(function(resolve, reject) {
    if (!platforms[platform].parser) return reject('Invalid platform');
    resolve(platforms[platform].parser(str));
  });
};

var findPlatform = function(filepath) {
  var pm;
  Object.keys(platforms).some( (_pm) => {
    pm = _pm;
    if (platforms[pm].filter(filepath)) { return true; } else { pm = null; }
  });
  return pm;
};

module.exports = {
  parse: parse,
  findPlatform: findPlatform
};
