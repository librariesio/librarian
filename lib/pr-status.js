/*jshint globalstrict:true, trailing:false, unused:true, node:true */
"use strict";

require("babel/register");

var GitHub = require('./github');
var redis  = require('./redis');
var debug  = require('debug')('librarian');
var assert = require('assert');
var _ = require('underscore');
var diff = require('deep-diff').diff;


var parser = {
  npm: function(str) {
    var deps = JSON.parse(str).dependencies;
    return Object.keys(deps)
    .reduce(function(accum, dep) {
      accum.push([dep, deps[dep]]);
      return accum;
    }, []);
  },
  rubygems: function(str) {
    return str.split("\n").reduce(function(accum,line) {
      var match = line.replace(/'|"/g,'').match(/gem (.+),?(.+)?/i);
      if (match) accum.push([match[1], match[2] || 'latest']);
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
    var basepm = Object.keys(manifests.base);


    var headBlobs = pm.map(function(pm) {
      return repo.blob(manifests.head[pm].sha);
    });
    var baseBlobs = pm.map(function(pm) {
      return repo.blob(manifests.base[basepm].sha);
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
        var _parser = parser[_pm];
        var _deps = _parser(str);

        deps.push({name: _pm, deps: _deps});
      });

      baseBlobs.forEach(function(blob, index) {
        var str = new Buffer(blob.content, 'base64').toString('utf8');
        var _pm = pm[index];
        var _parser = parser[_pm];
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
