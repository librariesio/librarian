'use strict';

require("babel/register");

var GitHub = require('../github');
var Lib    = require('../libraries');
var Repo   = require('../repo');
var redis  = require('../redis');
var debug  = require('debug')('librarian');

var PORT    = process.env.PORT || 5000;
var BASEURL = process.env.HOST || 'http://localhost:' + PORT;

var createWebhook = function(user, repoName, gh) {
  var webhook_url = BASEURL + '/webhooks/' + user;

  var body = {
    name: 'web',
    active: 'true',
    events: ['push', 'pull_request'],
    config: {
      url: webhook_url,
      content_type: 'json'
    }
  };

  return gh.post('/repos/' + repoName + '/hooks', null, body);
};

var subscribeLibraries = function(user, repoName, gh) {
  let [owner, name] = repoName.split('/');
  var repo = new Repo(owner, name, gh);
  return repo.findDependencies()
  .then( (manifests) => {
    var packages = manifests.reduce( (a,m) => {
      a[m.name] = Object.keys(m.deps);
      return a;
    }, {});

    var body =  {
      user: user,
      name: `github.com/${repoName}`,
      packages: packages
    };

    var lib = new Lib();
    return lib.post('/api/manifests/update', null, body);
  });
};


module.exports = function(req, res) {
  var repoName = req.body.repo;

  return redis.get(req.session.user)
  .then(function(token) {
    var gh = new GitHub(token);

    var user = req.session.user;
    return Promise.all([
      createWebhook(user, repoName, gh),
      subscribeLibraries(user, repoName, gh)
    ]);
  })
  .then(function() {
    res.redirect(302, '/repos');
  })
  .catch(function(err) {
    console.log(err.stack);
    res.render('error');
  });
};
