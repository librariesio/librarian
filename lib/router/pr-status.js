/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

require("babel/register");

var debug  = require('debug')('librarian');
var assert = require('assert');
var diff = require('deep-diff').diff;

var GitHub = require('../github');
var redis  = require('../redis');
var parsers = require('../parsers');

var prStatus = function(req, res) {
  var owner = req.param.owner;
  var repoName = req.params.owner + '/' + req.params.repo;
  var pr = req.params.pr;
  var key = repoName + ':pr:' + pr;

  return Promise.all([redis.get(key), redis.get(owner)])
  .then(function(values) {
    var data = values[0];
    var token = values[1];

    var gh = new GitHub(token);
    var manifests = JSON.parse(data) || {head: {}, base: {}};

    var state = 'Nothing changed';
    try {
      assert.deepEqual(manifests.base, manifests.head);
    } catch(err) {
      state = 'Dependencies modified in this PR';
    }

    var pm = Object.keys(manifests.head);
    var basepm = Object.keys(manifests.base);


    var headBlobs = pm.map(function(pm) {
      var sha = manifests.head[pm].sha;
      return gh.get('/repos/' + repoName + '/git/blobs/' + sha);
    });
    var baseBlobs = pm.map(function(pm) {
      var sha = manifests.base[basepm].sha;
      return gh.get('/repos/' + repoName + '/git/blobs/' + sha);
    });

    return Promise.all([
      Promise.all(headBlobs), 
      Promise.all(baseBlobs)
    ])
    .then(function(values) {
      var blobs = values[0];
      var baseBlobs = values[1];

      var deps = [];
      var baseDeps = [];

      blobs.forEach(function(blob, index) {
        var str = new Buffer(blob.content, 'base64').toString('utf8');
        var _pm = pm[index];
        var _parser = parsers[_pm];
        var _deps = _parser(str);

        deps.push({name: _pm, deps: _deps});
      });

      baseBlobs.forEach(function(blob, index) {
        var str = new Buffer(blob.content, 'base64').toString('utf8');
        var _pm = pm[index];
        var _parser = parsers[_pm];
        var _deps = _parser(str);

        baseDeps.push({name: _pm, deps: _deps});
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
