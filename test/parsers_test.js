var assert  = require('assert');
var fs = require('fs');

var parsers = require('../lib/parsers');

describe('Parser', function(){
  it('should parse package.json', function() {
    var str = fs.readFileSync(__dirname + '/fixtures/package.json').toString();
    var deps = parsers.npm(str);
    assert.deepEqual(deps[0], ['babel', '^4.6.6']);
  });

  it('should parse bower.json', function() {
    var str = fs.readFileSync(__dirname + '/fixtures/bower.json').toString();
    var deps = parsers.bower(str);
    assert.deepEqual(deps[0], ['sass-bootstrap', '~3.0.0']);
  });

  it('should parse Gemfile (naive)', function() {
    var str = fs.readFileSync(__dirname + '/fixtures/Gemfile').toString();
    var deps = parsers.rubygems(str);
    assert.deepEqual(deps[0], ['oj', 'latest']);
  });

  it('should parse (APT) dpkg -l output', function() {
    var str = fs.readFileSync(__dirname + '/fixtures/dpkg').toString();
    var deps = parsers.dpkg(str);
    console.log('deps', deps);
    assert.deepEqual(deps[0], ['accountsservice', '0.6.15-2ubuntu9.6']);
  });
});
