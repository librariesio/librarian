/*jshint globalstrict:true, trailing:false, unused:true, node:true */
"use strict";

require("babel/register");

var octonode  = require('octonode');

function GitHub(token, repo) {
  var client = octonode.client(token);
  this.repo = client.repo(repo);
}

GitHub.prototype.commit = function(sha) {
  var repo = this.repo;
  return new Promise(function(resolve, reject) {
    repo.commit(sha, function(err, data) {
      return err ? reject(err) : resolve(data);
    });
  });
};

GitHub.prototype.tree = function(sha) {
  var repo = this.repo;
  return new Promise(function(resolve, reject) {
    repo.tree(sha, function(err, data) {
      return err ? reject(err) : resolve(data);
    });
  });
};

GitHub.prototype.blob = function(sha) {
  var repo = this.repo;
  return new Promise(function(resolve, reject) {
    repo.blob(sha, function(err, data) {
      return err ? reject(err) : resolve(data);
    });
  });
};

GitHub.prototype.newStatus = function(sha, status) {
  var repo = this.repo;
  return new Promise(function(resolve, reject) {
    repo.status(sha, status, function(err, data) {
      return err ? reject(err) : resolve(data);
    });
  });
};

module.exports = GitHub;
