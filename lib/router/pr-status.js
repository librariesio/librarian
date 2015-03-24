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
    var data  = values[0];
    var token = values[1];

    var gh = new GitHub(token);
    var repo = new Repo(owner, name, gh);
    var manifests = JSON.parse(data) || {head: {}, base: {}};

    return gh.get(`/repos/${owner}/${name}/pulls/${pr}`)
    .then( (pr) => {
      return Promise.all([
        pr,
        repo.findDependencies(pr.base.sha),
        repo.findDependencies(pr.head.sha)
      ]);
    })
    .then( (values) => {
      var pr = values[0];
      var baseDeps = values[1];
      var headDeps = values[2];

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


var _prStatus = function(req, res) {
  var owner = req.params.owner;
  var repo  = req.params.repo;
  var pr    = req.params.pr;
  var key   = `${owner}/${repo}:pr:${pr}`;

  return Promise.all([
    redis.get(key),
    redis.get(owner)
  ])
  .then(function(values) {
    var data  = values[0];
    var token = values[1];

    var gh = new GitHub(token);
    var manifests = JSON.parse(data) || {head: {}, base: {}};

    console.log('manifests', manifests);

    //gh.get(`/repos/${owner}/${name}/pulls/${pr}`)
  
    var state;
    if (deepEqual(manifests.base, manifests.head)) {
      state = 'Nothing changed';
    } else {
      state = 'Dependencies modified in this PR';
    }

    var basepm = Object.keys(manifests.base);
    var headpm = Object.keys(manifests.head);

    var fetchBaseBlobs = basepm.map(function(pm) {
      var sha = manifests.base[pm].sha;
      return gh.get(`/repos/${owner}/${repo}/git/blobs/${sha}`);
    });

    var fetchHeadBlobs = headpm.map(function(pm) {
      var sha = manifests.head[pm].sha;
      return gh.get(`/repos/${owner}/${repo}/git/blobs/${sha}`);
    });

    return Promise.all([
      Promise.all(fetchBaseBlobs),
      Promise.all(fetchHeadBlobs) 
    ])
    .then(function(values) {
      var baseBlobs = values[0];
      var headBlobs = values[1];

      var headDeps = [];
      var baseDeps = [];

      var deps = basepm.concat(headpm).reduce( (accum, pm) => {
        accum[pm] = {base: {}, head: {}};
        return accum;
      }, {});

      baseBlobs.forEach(function(blob, index) {
        var str = new Buffer(blob.content, 'base64').toString('utf8');
        var pm = basepm[index];
        var tuples = parsers[pm](str);

        var base = tuples.reduce( (accum, dep) => {
          accum[dep[0]] = dep[1];
          return accum;
        }, {});

        deps[pm].base = base;
        baseDeps.push({name: pm, deps: tuples});
      });


      headBlobs.forEach(function(blob, index) {
        var str = new Buffer(blob.content, 'base64').toString('utf8');
        var pm = headpm[index];
        var tuples = parsers[pm](str);

        var head = tuples.reduce( (accum, dep) => {
          accum[dep[0]] = dep[1];
          return accum;
        }, {});

        deps[pm].head = head;
        headDeps.push({name: pm, deps: tuples});
      });

      var diffs = Object.keys(deps).map(function(k) {
        return {name: k, diff: deepDiff(deps[k].base, deps[k].head)};
      });

      return res.render('pr', {
        pr: pr, 
        state: state,
        baseDeps: baseDeps,
        headDeps: headDeps,
        diffs: diffs
      });
    });
  })
  .catch(function(err) {
    console.log('ERROR:', err);
    console.log(err.stack);
    res.end(err);
  });
};

module.exports = prStatus;
