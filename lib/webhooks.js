/*jshint globalstrict:true, trailing:false, unused:true, node:true */
"use strict";

require("babel/register");

var PORT    = process.env.PORT || 5000;
var BASEURL = process.env.HOST || 'http://localhost:' + PORT;

// Supported manifests
var SUPPORTED = {
  'package.json': 'npm',
  'Gemfile':      'rubygems'
};

var GitHub = require('./github');
var redis  = require('./redis');
var debug  = require('debug')('librarian');
var assert = require('assert');

var detectManifests = function(files) {
  return files.reduce(function(accum, file) {
    var filename = file.path.split('/').pop();
    var pm = SUPPORTED[filename];
    if (pm) accum[pm] = file;
    return accum;
  }, {});
};

var check = function(username, headers, payload) {

  var pr        = payload.number;
  var headsha   = payload.pull_request.head.sha;
  var basesha   = payload.pull_request.base.sha;
  var repoName  = payload.repository.full_name;

  return redis.get(username)
  .then(function(token) {
    var repo = new GitHub(token, repoName);

    return Promise.all([
      repo.commit(basesha), 
      repo.commit(headsha)
    ])
    .then(function(values) {
      var baseCommit = values[0];
      var commit = values[1];

      return Promise.all([
        repo.tree(baseCommit.commit.tree.sha),
        repo.tree(commit.commit.tree.sha)
      ]);
    })
    .then(function(values) {
      var baseFiles = values[0].tree;
      var files = values[1].tree;

      var manifests = {
        base: detectManifests(baseFiles),
        head: detectManifests(files)
      };

      return manifests;
    })
    .then(function(manifests) {
      var key = repoName + ':pr:' + pr;
      var value = JSON.stringify(manifests);

      return Promise.all([
        manifests,
        redis.set(key, value)
      ]);
    })
    .then(function(values) {
      var manifests = values[0];

      var state = 'success';
      try {
        assert.deepEqual(manifests.base, manifests.head);
      } catch(err) {
        state = 'pending';
      }

      var status = {
        state:        state,
        target_url:   BASEURL + '/repos/' + repoName + '/pull/' + pr,
        description:  'Dependencies check',
        context:      'continuous-integration/libraries'
      };

      return repo.newStatus(headsha, status);
    });
  })
  .catch(function(err) {
    console.log('ERROR:', err);
    console.log(err.stack);
  });
};

var webhook = function(req, res) {
  res.end(); // 200 early

  var username  = req.params.username;
  var headers   = req.headers;
  var payload   = req.body;

  debug('Event:' + headers['x-github-event']);

  if (headers['x-github-event'] !== 'pull_request') return;

  check(username, headers, payload);
};

module.exports = webhook;
