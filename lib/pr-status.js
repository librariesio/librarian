/*jshint globalstrict:true, trailing:false, unused:true, node:true */
"use strict";

require("babel/register");

var GitHub = require('./github');
var redis  = require('./redis');
var debug  = require('debug')('librarian');
var assert = require('assert');

var parser = {
  npm: function(str) {
    return JSON.parse(str).dependencies;
  },
  rubygems: function(str) {
    return str.split("\n").reduce(function(accum,line) {
      var match = line.match(/gem "?'?(\w+)"?'?/i);
      if (match) accum.push(match[1]);
      return accum;
    }, []);
  }
};

var prStatus = function(req, res) {
  var owner = req.param.owner;
  var repoName = req.params.owner + '/' + req.params.repo;
  var pr = req.params.pr;
  var key = repoName + ':pr:' + pr;

  return Promise.all([redis.get(key), redis.get(owner)])
  .then(function(values) {
    var data = values[0];
    var token = values[1];

    var repo = new GitHub(token, repoName);
    var manifests = JSON.parse(data) || {head: {}, base: {}};

    var state = 'Nothing changed';
    try {
      assert.deepEqual(manifests.base, manifests.head);
    } catch(err) {
      state = 'Dependencies modified in this PR';
    }

    var pm = Object.keys(manifests.head);

    var fetchBlobs = pm.map(function(pm) {
      return repo.blob(manifests.head[pm].sha);
    });

    return Promise.all(fetchBlobs)
    .then(function(blobs) {
      var deps = [];

      blobs.forEach(function(blob, index) {
        var str = new Buffer(blob.content, 'base64').toString('utf8');
        var _pm = pm[index];
        var _parser = parser[_pm];
        var _deps = _parser(str);

        deps.push({name: _pm, deps: _deps});
      });

      return res.render('pr', {pr: pr, state: state, deps: deps});
    });

  })
  .catch(function(err) {
    console.log('ERROR:', err);
    console.log(err.stack);
    res.end(err);
  });
};

module.exports = prStatus;
