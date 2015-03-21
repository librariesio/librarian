var assert  = require('assert');
var fs = require('fs');

var parsers = require('../lib/parsers');

describe('Parser', function(){
  it('should parse package.json', function() {
    var str = fs.readFileSync(__dirname + '/fixtures/package.json').toString();
    var deps = parsers.npm(str);
    assert(['babel', '^4.6.6.'], deps[0]);
  });

  it('should parse bower.json', function() {
    var str = fs.readFileSync(__dirname + '/fixtures/bower.json').toString();
    var deps = parsers.bower(str);
    assert.deepEqual(deps[0], ['sass-bootstrap', '~3.0.0']);
  });

  it('should parse Gemfile (naive)', function() {
    var str = fs.readFileSync(__dirname + '/fixtures/Gemfile').toString();
    var deps = parsers.rubygems(str);
    assert(['oj', 'latest'], deps[0]);
  });
});
