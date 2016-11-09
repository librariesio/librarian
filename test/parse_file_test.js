var server = require('../app');
var assert = require('assert');
var request = require('request');
var fs = require('fs');

describe('/v2/parse_file', function () {
  it('should return 200', function (done) {
    var contents = fs.readFileSync(__dirname +'/fixtures/DESCRIPTION').toString();

    request.post('http://localhost:5000/v2/parse_file?filepath=DESCRIPTION', { json: { contents: contents } }, function (error, response, body) {
      assert.equal(200, response.statusCode);
      done();
    });
  });
});
