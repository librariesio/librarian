/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

require("babel/register");

var GitHub = require('../github');
var redis  = require('../redis');
var semver = require('semver');
var Repo   = require('../repo');
var Lib    = require('../libraries');

module.exports = function(req, res) {
  var owner = req.params.owner;
  var name  = req.params.repo;

  return redis.get(owner)
  .then( (token) => {
    var gh = new GitHub(token);
    var repo = new Repo(owner, name, gh);

    return repo.findDependencies()
    .then( (manifests) => {
      return repo.fetchVersions(manifests);
    })
    .then( (manifests) => {
      res.render('repo', {repo: `${owner}/${name}`, manifests: manifests});
    });
  })
  .catch( (err) => {
    console.log(err.stack);
    res.render('error');
  });
};