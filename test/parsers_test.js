var assert  = require('assert');
var fs = require('fs');

var parsers = require('../lib/parsers');

describe('Parser', function(){
  it('should parse package.json', function() {
    var str = fs.readFileSync(__dirname + '/fixtures/package.json').toString();
    var deps = parsers.npm(str);
    assert(['babel', '^4.6.6.'], deps[0]);
  });

  it('should parse composer.json', function() {
    var str = fs.readFileSync(__dirname + '/fixtures/composer.json').toString();
    var deps = parsers.packagist(str);
    assert(["laravel/framework", "5.0.*"], deps[0]);
  });

  it('should parse Gemfile (naive)', function() {
    var str = fs.readFileSync(__dirname + '/fixtures/Gemfile').toString();
    var deps = parsers.rubygems(str);
    assert(['oj', 'latest'], deps[0]);
  });
});
