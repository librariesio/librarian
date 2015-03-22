var assert  = require('assert');
var fs = require('fs');

var parsers = require('../lib/parsers');

describe('Parser', function(){
  it('should parse package.json', function() {
    var str = fs.readFileSync(__dirname + '/fixtures/package.json').toString();
    var deps = parsers.npm(str);
    assert.deepEqual(deps[0], ['babel', '^4.6.6']);
  });

  it('should parse composer.json', function() {
    var str = fs.readFileSync(__dirname + '/fixtures/composer.json').toString();
    var deps = parsers.packagist(str);
    assert.deepEqual(deps[0], ["laravel/framework", "5.0.*"]);
  });

  it('should parse Cargo.toml', function() {
    var str = fs.readFileSync(__dirname + '/fixtures/Cargo.toml').toString();
    var deps = parsers.cargo(str);
    assert.deepEqual(deps[0], ["rustc-serialize", "*"]);
  });

  it('should parse bower.json', function() {
    var str = fs.readFileSync(__dirname + '/fixtures/bower.json').toString();
    var deps = parsers.bower(str);
    assert.deepEqual(deps[0], ['sass-bootstrap', '~3.0.0']);
  });
  it('should parse pubspec.yaml', function() {
    var str = fs.readFileSync(__dirname + '/fixtures/pubspec.yaml').toString();
    var deps = parsers.pub(str);
    assert.deepEqual(deps[0], ['analyzer', '>=0.22.0 <0.25.0']);
  });

  it('should parse Gemfile (naive)', function() {
    var str = fs.readFileSync(__dirname + '/fixtures/Gemfile').toString();
    var deps = parsers.rubygems(str);
    assert.deepEqual(deps[0], ['oj', 'latest']);
    assert.deepEqual(deps[2], ['rails', '4.2.0']);
  });

  it('should parse Cocoapods (naive)', function() {
    var str = fs.readFileSync(__dirname + '/fixtures/Podfile').toString();
    var deps = parsers.cocoapods(str);
    assert.deepEqual(deps[0], ['AFNetworking', '~> 1.0']);
  });

  it('should parse (APT) dpkg -l output', function() {
    var str = fs.readFileSync(__dirname + '/fixtures/dpkg').toString();
    var deps = parsers.dpkg(str);
    assert.deepEqual(deps[0], ['accountsservice', '0.6.15-2ubuntu9.6']);
  });
});
