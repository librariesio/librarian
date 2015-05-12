'use strict';

var SUPPORTED = {
  'bower.json':       'bower',
  'Cargo.toml':       'cargo',
  'composer.json':    'packagist',
  'dpkg':             'dpkg',
  'dub.json':         'dub',
  'example.nuspec':   'nuspec',
  'elm-package.json': 'elm',
  'Gemfile':          'rubygems',
  'gems.rb':          'rubygems',
  'package.json':     'npm',
  'Podfile':          'cocoapods',
  'pubspec.yaml':     'pub'
};

var detectManifests = function(files) {
  return files.reduce(function(accum, file) {
    var filename = file.path.split('/').pop();
    var pm = SUPPORTED[filename];
    if (pm) accum[pm] = file;
    return accum;
  }, {});
};

module.exports = {
  detectManifests: detectManifests
};
