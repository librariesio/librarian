/*jshint globalstrict:true, trailing:false, unused:true, node:true */
"use strict";

require("babel/register");

var github  = require('octonode');
var token   = 'c98a79d5d94f960fa9cc74b0b93ae121b60f00be';
var client  = github.client(token);

var fetchCommit = function(repo, sha) {
  return new Promise(function(resolve, reject) {
    repo.commit(sha, function(err, data) {
      err ? reject(err) : resolve(data);
    });
  });
};

var fetchTree = function(repo, sha) {
  return new Promise(function(resolve, reject) {
    repo.tree(sha, function(err, data) {
      err ? reject(err) : resolve(data);
    });
  });
};

var fetchBlob = function(repo, sha) {
  return new Promise(function(resolve, reject) {
    repo.blob(sha, function(err, data) {
      err ? reject(err) : resolve(data);
    });
  });
};

var createState = function(repo, sha, status) {
  return new Promise(function(resolve, reject) {
    repo.status(sha, status, function(err, data) {
      err ? reject(err) : resolve(data);
    });
  });
};

var check = function(payload) {
  var sha = payload.pull_request.head.sha;
  var repo = client.repo(payload.repository.full_name);

  //createState(repo, sha);

  return fetchCommit(repo, sha)
  .then(function(commit) {
    return fetchTree(repo, commit.commit.tree.sha);
  })
  .then(function(tree) {
    var sha;
    tree.tree.forEach(function(item) {
      if (item.path === 'package.json') sha = item.sha;
    });
    if (sha) {
      return fetchBlob(repo, sha);
    } else {
      throw("There's no package.json");
    }
  })
  .then(function(blob) {
    var str = new Buffer(blob.content, 'base64').toString('utf8');
    var json = JSON.parse(str);
    console.log(json.dependencies);
  })
  .then(function(json) {
    var status = {
      state:        'pending',
      target_url:   'http://libraries.io',
      description:  'Checking libraries',
      context:      'continuous-integration/libraries'
    };
    return createState(repo, sha, status);
  })
  .then(function(status) {
    console.log('Status created', status.url);
  })
  .catch(function(err) {
    console.log('ERR', err);
  });
};

var webhook = function(req, res) {
  res.end(); // 200 early

  //console.log(req.headers);
  //console.log(req.body);

  var headers = req.headers;
  var payload = req.body;

  console.log('Event:', headers['x-github-event']);

  if (headers['x-github-event'] !== 'pull_request') return;

  check(payload);
};

module.exports = webhook;
