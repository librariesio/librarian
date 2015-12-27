var assert  = require('assert');
var fs = require('fs');
var parsers = require('../lib/parsers');

var platformTests = [
  {
    platform: 'npm',
    fixture: 'package.json',
    expected: [
      {name: 'babel', version: '^4.6.6', type: 'runtime'},
      {name: 'mocha', version: '^2.2.1', type: 'development'}
    ],
    validManifestPaths: ['package.json'],
    invalidManifestPaths: ['node_modules/foo/package.json']
  },
  {
    platform: 'cpanMetaYML',
    fixture: 'META.yml',
    expected: [
      {name: "Digest::MD5", version: ">= 0", type: 'runtime'}
    ],
    validManifestPaths: ['META.yml'],
    invalidManifestPaths: []
  },
  {
    platform: 'cpanMetaJSON',
    fixture: 'META.json',
    expected: [
      {name: "English", version: ">= 1.00", type: 'build'}
    ],
    validManifestPaths: ['META.json'],
    invalidManifestPaths: []
  },
  {
    platform: 'npmshrinkwrap',
    fixture: 'npm-shrinkwrap.json',
    expected: [
      {name: 'babel', version: '4.7.16', type: 'runtime'}
    ],
    validManifestPaths: ['npm-shrinkwrap.json'],
    invalidManifestPaths: ['node_modules/foo/npm-shrinkwrap.json']
  },
  {
    platform: 'rubygems',
    fixture: 'Gemfile',
    expected: [
      {name: 'oj', version: '>= 0', type: 'runtime'},
      {name: 'rails', version: '= 4.2.0', type: 'runtime'},
      {name: 'leveldb-ruby', version: '= 0.15', type: 'runtime'},
      {name: 'spring', version: '>= 0', type: 'development'}
    ],
    validManifestPaths: ['Gemfile', 'gems.rb'],
    invalidManifestPaths: ['bundle/foo/Gemfile']
  },
  {
    platform: 'rubygemslockfile',
    fixture: 'Gemfile.lock',
    expected: [
      {name:'CFPropertyList', version: '2.3.1', type: 'runtime'},
      {name:'actionmailer', version: '4.2.3', type: 'runtime'}
    ],
    validManifestPaths: ['Gemfile.lock', 'gems.locked'],
    invalidManifestPaths: []
  },
  {
    platform: 'rubygems',
    fixture: 'gems.rb',
    expected: [
      {name: 'oj', version: '>= 0', type: 'runtime'},
      {name: 'rails', version: '= 4.2.0', type: 'runtime'},
      {name: 'leveldb-ruby', version: '= 0.15', type: 'runtime'},
      {name: 'spring', version: '>= 0', type: 'development'}
    ],
    validManifestPaths: ['gems.rb'],
    invalidManifestPaths: []
  },
  {
    platform: 'gemspec',
    fixture: 'devise.gemspec',
    expected: [
      {name: 'warden', version: '~> 1.2.3', type: 'runtime'},
      {name: 'orm_adapter', version: '~> 0.1', type: 'development'}
    ],
    validManifestPaths: ['devise.gemspec', 'foo_meh-bar.gemspec'],
    invalidManifestPaths: []
  },
  {
    platform: 'packagist',
    fixture: 'composer.json',
    expected: [
      {name: "laravel/framework", version: "5.0.*", type: 'runtime'}
    ],
    validManifestPaths: ['composer.json'],
    invalidManifestPaths: []
  },
  {
    platform: 'packagist',
    fixture: 'composer2.json',
    expected: [],
    validManifestPaths: [],
    invalidManifestPaths: []
  },
  {
    platform: 'nuspec',
    fixture: 'example.nuspec',
    expected: [
      {name: "FubuCore", version: "3.2.0.3001", type: 'runtime'}
    ],
    validManifestPaths: ['example.nuspec'],
    invalidManifestPaths: []
  },
  {
    platform: 'meteor',
    fixture: 'versions.json',
    expected: [["accounts-base", "1.1.2"]],
    validManifestPaths: ['versions.json'],
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
    expected: [
      {name: "rustc-serialize", version: "*", type: 'runtime'}
    ],
    validManifestPaths: ['Cargo.toml'],
    invalidManifestPaths: []
  },
  {
    platform: 'elm',
    fixture: 'elm-package.json',
    expected: [
      {name: "evancz/elm-markdown", version: "1.1.0 <= v < 2.0.0", type: 'runtime'}
    ],
    validManifestPaths: ['elm-package.json'],
    invalidManifestPaths: ['node_modules/foo/elm-package.json']
  },
  {
    platform: 'elm',
    fixture: 'elm_dependencies.json',
    expected: [
      {name: "johnpmayer/elm-webgl", version: "0.1.1", type: 'runtime'}
    ],
    validManifestPaths: ['elm_dependencies.json'],
    invalidManifestPaths: ['node_modules/foo/elm_dependencies.json']
  },
  {
    platform: 'bower',
    fixture: 'bower.json',
    expected: [
      {name: 'jquery', version: '>= 1.9.1', type: 'runtime'}
    ],
    validManifestPaths: ['bower.json'],
    invalidManifestPaths: ['node_modules/foo/bower.json']
  },
  {
    platform: 'dub',
    fixture: 'dub.json',
    expected: [
      {name: 'vibe-d', version: '~>0.7.22', type: 'runtime'},
      {name: 'libdparse', version: "~>0.2.0", type: 'optional'}
    ],
    validManifestPaths: ['dub.json'],
    invalidManifestPaths: []
  },
  {
    platform: 'pub',
    fixture: 'pubspec.yaml',
    expected: [
      {name: 'analyzer', version: '>=0.22.0 <0.25.0', type: 'runtime'},
      {name: 'args', version: '>=0.12.0 <0.13.0', type: 'runtime'},
      {name: 'benchmark_harness', version: '>=1.0.0 <2.0.0', type: 'development'},
      {name: 'guinness', version: '>=0.1.9 <0.2.0', type: 'development'}
    ],
    validManifestPaths: ['pubspec.yaml'],
    invalidManifestPaths: []
  },
  {
    platform: 'clojars',
    fixture: 'project.clj',
    expected: [
      {name: "org.clojure/clojure", version: "1.6.0", type: "runtime"},
      {name: 'cheshire', version: '5.4.0', type: 'runtime'}
    ],
    validManifestPaths: ['project.clj'],
    invalidManifestPaths: []
  },
  {
    platform: 'hex',
    fixture: 'mix.exs',
    expected: [
      {name: 'poison', version: '~> 1.3.1', type: 'runtime'}
    ],
    validManifestPaths: ['mix.exs'],
    invalidManifestPaths: []
  },
  {
    platform: 'hexLockfile',
    fixture: 'mix.lock',
    expected: [
      {name: 'poison', version: '~> 1.3.1', type: 'runtime'}
    ],
    validManifestPaths: ['mix.lock'],
    invalidManifestPaths: []
  },
  {
    platform: 'pypi',
    fixture: 'requirements.txt',
    expected: [
      {name: 'Flask', version: '0.8', type: 'runtime'},
      {name: 'zope.component', version: '4.2.2', type: 'runtime'},
      {name: 'scikit-learn', version: '0.16.1', type: 'runtime'},
      {name: 'Beaker', version: '1.6.5', type: 'runtime'}
    ],
    validManifestPaths: ['requirements.txt'],
    invalidManifestPaths: []
  },
  {
    platform: 'cocoapods',
    fixture: 'Podfile',
    expected: [
      {name: 'Artsy-UIButtons', version: '>= 0', type: 'runtime'}
    ],
    validManifestPaths: ['Podfile'],
    invalidManifestPaths: []
  },
  {
    platform: 'cocoapodsLockfile',
    fixture: 'Podfile.lock',
    expected: [
      {name: 'Alamofire', version: '2.0.1', type: 'runtime'}
    ],
    validManifestPaths: ['Podfile.lock'],
    invalidManifestPaths: []
  },
  {
    platform: 'nuget',
    fixture: 'Project.json',
    expected: [
      {name: "Microsoft.AspNet.Server.Kestrel", version: "1.0.0-beta7", type: 'runtime'}
    ],
    validManifestPaths: ['Project.json'],
    invalidManifestPaths: []
  },
  {
    platform: 'nugetLockfile',
    fixture: 'Project.lock.json',
    expected: [
      {name: "AutoMapper", version: "4.0.0-alpha1", type: 'runtime'}
    ],
    validManifestPaths: ['Project.lock.json'],
    invalidManifestPaths: []
  },
  {
    platform: 'julia',
    fixture: 'REQUIRE',
    expected: [
      {name: "julia", version: "0.3", type: 'runtime'},
      {name: "Codecs", version: ">= 0", type: 'runtime'}
    ],
    validManifestPaths: ['REQUIRE'],
    invalidManifestPaths: []
  }

  // DISABLED

  //{
  //  platform: 'dpkg',
  //  fixture: 'dpkg',
  //  expected: [['accountsservice', '0.6.15-2ubuntu9.6']],
  //  validManifestPaths: ['dpkg'],
  //  invalidManifestPaths: []
  //}

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
        assert(platform);
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
