/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

require("babel/register");

var GitHub = require('../github');
var redis  = require('../redis');
var parsers = require('../parsers');
var utils   = require('../utils');

module.exports = function(req, res) {
  var owner = req.params.owner;
  var repo  = req.params.repo;

  return redis.get(owner)
  .then(function(token) {
    var gh = new GitHub(token);

    return gh.get(`/repos/${owner}/${repo}/branches`)
    .then(function(branches) {
      var branch = branches.filter( b => b.name === 'master' )[0];
      var sha = branch.commit.sha;
      return gh.get(`/repos/${owner}/${repo}/git/trees/${sha}`, {recursive: 1});
    })
    .then(function(tree) {
      var manifests = utils.detectManifests(tree.tree);
      var pms = Object.keys(manifests);
      var files = pms.map( k => manifests[k] );
      var fetchFiles = files.map(function(file) {
        return gh.get(`/repos/${owner}/${repo}/git/blobs/${file.sha}`);
      });
      
      return Promise.all(fetchFiles)
      .then(function(blobs) {
        var deps = [];
        blobs.forEach(function(blob, index) {
          var str = new Buffer(blob.content, 'base64').toString('utf8');
          var pm = pms[index];
          var tuples = parsers[pm](str);

          deps.push({name: pm, deps: tuples});
        });

        res.render('repo', {repo: `${owner}/${repo}`, deps: deps});
      });

    });
  });
};
