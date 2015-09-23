
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
    platform: 'npmshrinkwrap',
    fixture: 'npm-shrinkwrap.json',
    expected: [['babel', '4.7.16']],
    validManifestPaths: ['npm-shrinkwrap.json'],
    invalidManifestPaths: ['node_modules/foo/npm-shrinkwrap.json']
  },
  {
    platform: 'packagist',
    fixture: 'composer.json',
    expected: [["laravel/framework", "5.0.*"]],
    validManifestPaths: ['composer.json'],
    invalidManifestPaths: []
  },
  {
    platform: 'maven',
    fixture: 'pom.xml',
    expected: [["org.hibernate/hibernate-core", "5.0.1.Final"]],
    validManifestPaths: ['pom.xml'],
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
    platform: 'packagistlockfile',
    fixture: 'composer.lock',
    expected: [
      ['doctrine/annotations', 'v1.2.1'],
      ['doctrine/cache', 'v1.3.1']
    ],
    validManifestPaths: ['composer.lock'],
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
    platform: 'elm',
    fixture: 'elm_dependencies.json',
    expected: [["johnpmayer/elm-webgl", "0.1.1"]],
    validManifestPaths: ['elm_dependencies.json'],
    invalidManifestPaths: ['node_modules/foo/elm_dependencies.json']
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
    platform: 'rubygemslockfile',
    fixture: 'Gemfile.lock',
    expected: [
      ['CFPropertyList', '2.3.1'],
      ['actionmailer', '4.2.3']
    ],
    validManifestPaths: ['Gemfile.lock'],
    invalidManifestPaths: []
  },
  {
    platform: 'gemspec',
    fixture: 'devise.gemspec',
    expected: [
      ['warden', '~> 1.2.3'],
      ['orm_adapter', '~> 0.1']
    ],
    validManifestPaths: ['devise.gemspec', 'foo_meh-bar.gemspec'],
    invalidManifestPaths: []
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
    platform: 'pypi',
    fixture: 'requirements.txt',
    expected: [
      ['Flask', '0.8'],
      ['zope.component', '4.2.2'],
      ['scikit-learn', '0.16.1'],
      ['Beaker', '1.6.5']
    ],
    validManifestPaths: ['requirements.txt'],
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
