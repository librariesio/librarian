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
    res.set('Content-Type', 'application/json; charset=utf-8');

    return res.send({
      repository: values[2],
      manifests: values[0],
      metadata: values[1]
    });
  })
  .catch(next);
};
