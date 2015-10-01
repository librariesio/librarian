'use strict';

var GitHub = require('../github');
var Repo   = require('../repo');

module.exports = function(req, res, next) {
  var owner = req.params.owner;
  var name  = req.params.repo;
  var token = req.query.token;

  var gh    = new GitHub(token);
  var repo  = new Repo(owner, name, gh);

  return Promise.all([
    repo.findDependencies(),
    gh.get(`/repos/${owner}/${name}`)
  ])
  .then( (values) => {
    let [manifests, _repo] = values;

    var oldFormat = manifests.reduce( (accum, manifest) => {
      var deps = manifest.dependencies.reduce( (accum, dep) => {
        accum[dep.name] = dep.version;
        return accum;
      }, {});

      accum.push({
        name: manifest.parserName,
        path: manifest.filepath,
        sha: manifest.sha,
        deps: deps
      });

      return accum;
    }, []);

    res.set('Content-Type', 'application/json; charset=utf-8');

    return res.send({
      repository: _repo, 
      manifests: oldFormat
    });

    //switch (req.headers.accept) {
    //  case 'application/json':
    //    res.set('Content-Type', 'application/json; charset=utf-8');
    //    return res.send({repository: _repo, manifests: manifests});
    //  default:
    //    return res.render('repo', {repo: _repo, manifests: manifests});
    //}
  })
  .catch(next);
};
