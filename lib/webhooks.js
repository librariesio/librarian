/*jshint globalstrict:true, trailing:false, unused:true, node:true */
"use strict";

require("babel/register");

var PORT    = process.env.PORT || 5000;
var BASEURL = process.env.HOST || 'http://localhost:' + PORT;

// Supported manifests
var SUPPORTED = ['package.json'];

var GitHub = require('./github');
var redis  = require('./redis');
var debug  = require('debug')('librarian');

var isSupportedManifest = function(item) {
  return SUPPORTED.indexOf(item.path) !== -1;
};

var check = function(username, headers, payload) {

  var pr        = payload.number;
  var sha       = payload.pull_request.head.sha;
  var repoName  = payload.repository.full_name;

  return redis.get(username)
  .then(function(token) {
    var repo = new GitHub(token, repoName);

    return repo.commit(sha)
    .then(function(commit) {
      return repo.tree(commit.commit.tree.sha);
    })
    .then(function(tree) {
      var files = tree.tree;
      var manifests = files.filter(isSupportedManifest);
      var state = manifests.length ? 'pending' : 'success';

      var status = {
        state:        state,
        target_url:   BASEURL + '/repos/' + repoName + '/pull/' + pr,
        description:  'Dependencies',
        context:      'continuous-integration/libraries'
      };

      return repo.newStatus(sha, status)
      .then(function() {
        return manifests;
      });
    })
    .then(function(manifests) {
      if (!manifests.length) return null;

      var key = repoName + ':pr:' + pr;
      var value = JSON.stringify(manifests);
      return redis.set(key, value);
    });
  })
  .catch(function(err) {
    console.log('ERROR', err);
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
