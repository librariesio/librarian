
require("babel/register");

var assert  = require('assert');
var fs = require('fs');

var parsers = require('../lib/parsers');

var platformTests = [
  {
    platform: 'npm',
    fixture: 'package.json',
    expected: [['babel', '^4.6.6']],
    validManifestPaths: ['package.json'],
    invalidManifestPaths: ['node_modules/foo/package.json']
  },
  {
    platform: 'packagist',
    fixture: 'composer.json',
    expected: [["laravel/framework", "5.0.*"]],
    validManifestPaths: ['composer.json'],
    invalidManifestPaths: []
  },
  {
    platform: 'packagist',
    fixture: 'composer2.json',
    expected: [[]],
    validManifestPaths: [],
    invalidManifestPaths: []
  },
  {
    platform: 'cargo',
    fixture: 'Cargo.toml',
    expected: [["rustc-serialize", "*"]],
    validManifestPaths: ['Cargo.toml'],
    invalidManifestPaths: []
  },
  {
    platform: 'elm',
    fixture: 'elm-package.json',
    expected: [["evancz/elm-markdown", "1.1.0 <= v < 2.0.0"]],
    validManifestPaths: ['elm-package.json'],
    invalidManifestPaths: ['node_modules/foo/elm-package.json']
  },
  {
    platform: 'bower',
    fixture: 'bower.json',
    expected: [['jquery', '>= 1.9.1']],
    validManifestPaths: ['bower.json'],
    invalidManifestPaths: ['node_modules/foo/bower.json']
  },
  {
    platform: 'pub',
    fixture: 'pubspec.yaml',
    expected: [['analyzer', '>=0.22.0 <0.25.0']],
    validManifestPaths: ['pubspec.yaml'],
    invalidManifestPaths: []

  },
  {
    platform: 'dub',
    fixture: 'dub.json',
    expected: [['vibe-d', '~>0.7.22']],
    validManifestPaths: ['dub.json'],
    invalidManifestPaths: []
  },
  {
    platform: 'rubygems',
    fixture: 'Gemfile',
    expected: [
      ['oj', '>= 0'],
      ['rails', '= 4.2.0'],
      ['leveldb-ruby', '= 0.15'],
      ['spring', '>= 0']
    ],
    validManifestPaths: ['Gemfile'],
    invalidManifestPaths: ['bundle/foo/Gemfile']
  },
  {
    platform: 'rubygems',
    fixture: 'gems.rb',
    expected: [
      ['oj', '>= 0'],
      ['rails', '= 4.2.0'],
      ['leveldb-ruby', '= 0.15'],
      ['spring', '>= 0']
    ],
    validManifestPaths: ['gems.rb'],
    invalidManifestPaths: []
  },
  {
    platform: 'cocoapods',
    fixture: 'Podfile',
    expected: [['AFNetworking', '~> 1.0']],
    validManifestPaths: ['Podfile'],
    invalidManifestPaths: []
  },
  {
    platform: 'dpkg',
    fixture: 'dpkg',
    expected: [['accountsservice', '0.6.15-2ubuntu9.6']],
    validManifestPaths: ['dpkg'],
    invalidManifestPaths: []
  },
  {
    platform: 'hex',
    fixture: 'mix.exs',
    expected: [['poison', '~> 1.3.1']],
    validManifestPaths: ['mix.exs'],
    invalidManifestPaths: []
  },
  {
    platform: 'pip',
    fixture: 'requeriments.txt',
    expected: [['Flask', '0.8']],
    validManifestPaths: ['requeriments.txt'],
    invalidManifestPaths: []
  }

];

describe('Parser', function(){
  this.timeout(5000);

  platformTests.forEach(function(test) {
    it('should handle '+ test.platform +' fixtures', function(done) {
      var str = fs.readFileSync(__dirname +'/fixtures/'+ test.fixture).toString();
      parsers.parse(test.platform, str)
      .then(function(packages) {
        test.expected.forEach(function(pkg, i) {
          assert.deepEqual(packages[i], pkg);
        });
      })
      .then(done)
      .catch(done);
    });

    it('should match valid '+ test.platform +' manifest paths', function() {
      test.validManifestPaths.forEach(function(path) {
        var platform = parsers.findPlatform(path);
        assert.equal(test.platform, platform);
      });
    });

    it('should ignore invalid '+ test.platform +' manifest paths', function() {
      test.invalidManifestPaths.forEach(function(path) {
        var platform = parsers.findPlatform(path);
        assert.equal(platform, null);
      });
    });
  });

});
