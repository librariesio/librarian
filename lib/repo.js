/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

require("babel/register");

var parsers = require('./parsers');
var utils   = require('./utils');

class Repo {
  constructor(owner, repo, gh) {
    this.owner = owner;
    this.repo = repo;
    this.gh = gh;
  }

  findDependencies() {
    return this.findManifests()
    .then( (manifests) => {
      return this.fetchDependencies(manifests);
    });
  }

  findManifests() {
    return this.gh.get(`/repos/${this.owner}/${this.repo}/branches`)
    .then( (branches) => {
      var branch = branches.filter( b => b.name === 'master' )[0];
      var sha = branch.commit.sha;
      return this.gh.get(`/repos/${this.owner}/${this.repo}/git/trees/${sha}`, {
        recursive: 1
      });
    })
    .then( (tree) => {
      var manifests = utils.detectManifests(tree.tree);
      return manifests;
    });
  }
  
  fetchDependencies(manifests) {
    var pms = Object.keys(manifests);
    var files = pms.map( k => manifests[k] );
  
    var fetchFiles = files.map( (file) => {
      return this.gh.get(`/repos/${this.owner}/${this.repo}/git/blobs/${file.sha}`);
    });
    
    return Promise.all(fetchFiles)
    .then(function(blobs) {
      var deps = {};
  
      blobs.forEach(function(blob, index) {
        var str = new Buffer(blob.content, 'base64').toString('utf8');
        var pm = pms[index];
        var tuples = parsers[pm](str);
  
        var _deps = tuples.reduce( (accum, dep) => {
          accum[dep[0]] = dep[1];
          return accum;
        }, {});
  
        deps[pm] = _deps;
      });
  
      return deps;
    });
  }
}

module.exports = Repo;
