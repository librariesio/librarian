/*jshint globalstrict:true, trailing:false, unused:true, node:true */
"use strict";

require("babel/register");

var GitHub = require('./github');
var redis  = require('./redis');
var debug  = require('debug')('librarian');

var prStatus = function(req, res) {
  var owner = req.param.owner;
  var repoName = req.params.owner + '/' + req.params.repo;
  var pr = req.params.pr;
  var key = repoName + ':pr:' + pr;

  return Promise.all([redis.get(key), redis.get(owner)])
  .then(function(values) {
    var data = values[0];
    var token = values[1];

    if (!data) return res.end('no data');

    var repo = new GitHub(token, repoName);
    var files = JSON.parse(data);
    var fetchBlobs = files.map(function(file) {
      return repo.blob(file.sha);
    });

    return Promise.all(fetchBlobs)
    .then(function(blobs) {
      var deps = blobs.map(function(blob) {
        var str = new Buffer(blob.content, 'base64').toString('utf8');
        return JSON.parse(str).dependencies;
      });
      debug(deps);
      return res.render('pr', {pr: pr, deps: deps});
    });
  })
  .catch(function(err) {
    res.end(err);
    debug(err.stack);
  });
};

module.exports = prStatus;
