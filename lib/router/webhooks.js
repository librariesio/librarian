/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

require("babel/register");

var PORT    = process.env.PORT || 5000;
var BASEURL = process.env.HOST || 'http://localhost:' + PORT;

var GitHub = require('../github');
var Lib     = require('../libraries');
var redis  = require('../redis');
var debug  = require('debug')('librarian');
var Repo    = require('../repo');
var deepEqual = require('deep-equal');

var updateStatus = function(username, headers, payload) {
  var headsha   = payload.pull_request.head.sha;
  var basesha   = payload.pull_request.base.sha;
  var repoName  = payload.repository.full_name;

  return redis.get(username)
  .then(function(token) {
    var gh = new GitHub(token);
    let [owner, name] = payload.repository.full_name.split('/');

    var repo = new Repo(owner, name, gh);
    return Promise.all([
      payload,
      repo.findDependencies(basesha),
      repo.findDependencies(headsha)
    ])
    .then( (values) => {
      var pr = values[0];
      var baseDeps = values[1];
      var headDeps = values[2];

      var state = deepEqual(baseDeps, headDeps) ? 'success' : 'pending';

      var status = {
        state:        state,
        target_url:   `${BASEURL}/repos/${repoName}/pull/${pr.number}`,
        description:  'Dependencies check',
        context:      'continuous-integration/libraries'
      };

      return gh.post(`/repos/${repoName}/statuses/${headsha}`, null, status);
    });
  })
  .catch(function(err) {
    console.log('ERROR:', err);
    console.log(err.stack);
  });
};

var updateSubscription = function(username, headers, payload) {
  if (payload.ref !== `refs/heads/${payload.repository.default_branch}`) return;

  return redis.get(username)
  .then(function(token) {
    var gh = new GitHub(token);
    let [owner, name] = payload.repository.full_name.split('/');

    var repo = new Repo(owner, name, gh);
    return repo.findDependencies()
    .then( (manifests) => {
      var packages = manifests.reduce( (a,m) => {
        a[m.name] = Object.keys(m.deps);
        return a;
      }, {});

      var body =  {
        user: owner,
        name: `github.com/${owner}/${name}`,
        packages: packages
      };

      var lib = new Lib();
      return lib.post('/api/manifests/update', null, body);
    });
  });
};

var webhook = function(req, res) {
  res.end(); // 200 early

  var username  = req.params.username;
  var headers   = req.headers;
  var payload   = req.body;

  debug('Event:' + headers['x-github-event']);

  switch(headers['x-github-event']) {
    case 'pull_request':
      updateStatus(username, headers, payload);
      break;
    case 'push':
      updateSubscription(username, headers, payload);
      break;
    default:
      return;
  }
};

module.exports = webhook;
