'use strict';

var deepDiff  = require('deep-diff').diff;
var deepEqual = require('deep-equal');
var GitHub = require('../github');
var Repo  = require('../repo');

var prStatus = function(req, res, next) {
  var owner = req.params.owner;
  var name  = req.params.repo;
  var pr    = req.params.pr;
  var token = req.query.token;

  var gh = new GitHub(token);
  var repo = new Repo(owner, name, gh);

  return gh.get(`/repos/${owner}/${name}/pulls/${pr}`)
  .then( (pr) => {
    return Promise.all([
      pr,
      repo.findDependencies(pr.base.sha),
      repo.findDependencies(pr.head.sha)
    ]);
  })
  .then( (values) => {
    let [pr, baseDeps, headDeps] = values;

    var changes = !deepEqual(baseDeps, headDeps);
    var allDeps = baseDeps.concat(headDeps);
    var deps = allDeps.reduce( (a, m) => {
      a[m.path] = {base: {}, head: {}};
      return a;
    }, {});

    baseDeps.forEach( (m) => deps[m.path].base = m.deps );
    headDeps.forEach( (m) => deps[m.path].head = m.deps );

    var diffs = Object.keys(deps).map(function(k) {
      return {name: k, diff: deepDiff(deps[k].base, deps[k].head)};
    });

    var data = {
      pr: pr,
      changes: changes,
      baseDeps: baseDeps,
      headDeps: headDeps,
      diffs: diffs
    };

    if (req.headers.accept.match(/application\/json/)) {
      res.set('Content-Type', 'application/json; charset=utf-8');
      res.send(data);
    } else {
      res.render('pr', data);
    }
  })
  .catch(next);
};

module.exports = prStatus;
