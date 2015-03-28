
require("babel/register");

var assert  = require('assert');
var fs = require('fs');

var parsers = require('../lib/parsers');

var platformTests = [
  {
    platform: 'npm',
    manifest: 'package.json',
    expected: [['babel', '^4.6.6']]
  },
  {
    platform: 'packagist',
    manifest: 'composer.json',
    expected: [["laravel/framework", "5.0.*"]]
  },

  {
    platform: 'cargo',
    manifest: 'Cargo.toml',
    expected: [["rustc-serialize", "*"]]
  },
  {
    platform: 'elm',
    manifest: 'elm-package.json',
    expected: [["evancz/elm-markdown", "1.1.0 <= v < 2.0.0"]]
  },
  {
    platform: 'bower',
    manifest: 'bower.json',
    expected: [['sass-bootstrap', '~3.0.0']]
  },
  {
    platform: 'pub',
    manifest: 'pubspec.yaml',
    expected: [['analyzer', '>=0.22.0 <0.25.0']]
  },
  {
    platform: 'dub',
    manifest: 'dub.json',
    expected: [['vibe-d', '~>0.7.22']]
  },
  {
    platform: 'rubygems',
    manifest: 'Gemfile',
    expected: [
      ['oj', 'latest'],
      ['rails', '4.2.0'],
      ['leveldb-ruby', '0.15'],
      ['spring', 'latest']
    ]
  },
  {
    platform: 'cocoapods',
    manifest: 'Podfile',
    expected: [['AFNetworking', '~> 1.0']]
  },
  {
    platform: 'dpkg',
    manifest: 'dpkg',
    expected: [['accountsservice', '0.6.15-2ubuntu9.6']]
  }
];

describe('Parser', function(){
  platformTests.forEach(function(test) {
    it('should handle '+ test.platform +' manifests', function(done) {
      var str = fs.readFileSync(__dirname + '/fixtures/' + test.manifest).toString();
      parsers.parse(test.platform, str)
      .then(function(packages) {
        test.expected.forEach(function(pkg, i) {
          assert.deepEqual(packages[i], pkg);
        });
      })
      .then(done)
      .catch(done);
    });
  });
});
