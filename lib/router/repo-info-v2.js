'use strict';

var GitHub = require('libhub');
var Repo   = require('../repo');

module.exports = function(req, res, next) {
  var owner = req.params.owner;
  var name  = req.params.repo;
  var token = req.query.token;

  var gh    = new GitHub(token);
  var repo  = new Repo(owner, name, gh);

  return Promise.all([
    repo.findDependencies(),
    repo.findMetadata(),
    gh.get(`/repos/${owner}/${name}`)
  ])
  .then( (values) => {
    let [manifests, metadata, _repo] = values;

    res.set('Content-Type', 'application/json; charset=utf-8');

    return res.send({
      repository: _repo,
      manifests: manifests,
      metadata: metadata
    });
  })
  .catch(next);
};
