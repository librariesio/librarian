/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

require("babel/register");

var PORT    = process.env.PORT || 5000;
var BASEURL = process.env.HOST || 'http://localhost:' + PORT;

var GitHub = require('../github');
var redis  = require('../redis');
var debug  = require('debug')('librarian');
var Repo    = require('../repo');
var deepEqual = require('deep-equal');

var check = function(username, headers, payload) {

  var headsha   = payload.pull_request.head.sha;
  var basesha   = payload.pull_request.base.sha;
  var repoName  = payload.repository.full_name;

  return redis.get(username)
  .then(function(token) {
    var gh = new GitHub(token);
    var owner = payload.repository.full_name.split('/')[0];
    var name = payload.repository.full_name.split('/')[1];

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
