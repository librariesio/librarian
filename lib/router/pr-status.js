/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

require("babel/register");

var debug  = require('debug')('librarian');

var deepDiff  = require('deep-diff').diff;
var deepEqual = require('deep-equal');

var GitHub = require('../github');
var redis  = require('../redis');
var parsers = require('../parsers');
var Repo  = require('../repo');

var prStatus = function(req, res) {
  var owner = req.params.owner;
  var name  = req.params.repo;
  var pr    = req.params.pr;
  var key   = `${owner}/${name}:pr:${pr}`;

  return Promise.all([
    redis.get(key),
    redis.get(owner)
  ])
  .then(function(values) {
    let [data, token] = values;

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

      return res.render('pr', {
        pr: pr,
        changes: changes,
        baseDeps: baseDeps,
        headDeps: headDeps,
        diffs: diffs
      });
    });
  })
  .catch( (err) => {
    console.log(err.stack);
    res.render('error');
  });
};

module.exports = prStatus;
