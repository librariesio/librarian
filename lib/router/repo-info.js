'use strict';

var GitHub = require('../github');
var Repo   = require('../repo');

module.exports = function(req, res, next) {
  var owner = req.params.owner;
  var name  = req.params.repo;
  var token = req.query.token;

  var gh    = new GitHub(token);
  var repo  = new Repo(owner, name, gh);

  Promise.all([
    repo.findDependencies(),
    gh.get(`/repos/${owner}/${name}`)
  ])
  .then( (values) => {
    let [manifests, _repo] = values;

    switch (req.headers.accept) {
      case 'application/json':
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send({repository: _repo, manifests: manifests});
        break;
      default:
        res.render('repo', {repo: _repo, manifests: manifests});
    }
  })
  .catch(next);
};
