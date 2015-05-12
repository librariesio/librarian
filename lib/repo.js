/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

require("babel/register");

var Parsers = require('./parsers');
var Lib = require('./libraries');

class Repo {
  constructor(owner, repo, gh) {
    this.owner = owner;
    this.repo = repo;
    this.gh = gh;
    this.lib = new Lib();
  }

  findDependencies(sha) {
    var fetchSHA = sha ? Promise.resolve(sha) : this.fetchDefaultBranch();

    return fetchSHA
    .then( (sha) => {
      return this.findManifestsAt(sha);
    })
    .then( (manifests) => {
      return this.fetchBlobs(manifests);
    })
    .then( (manifests) => {
      return this.parseBlobs(manifests);
    });
  }

  fetchDefaultBranch() {
    return this.gh.get(`/repos/${this.owner}/${this.repo}`)
    .then( (repo) => {
      var branch = repo.default_branch;
      return this.gh.get(`/repos/${this.owner}/${this.repo}/branches/${branch}`);
    })
    .then( (branch) => {
      return branch.commit.sha;
    });
  }

  findManifestsAt(sha) {
    return this.gh.get(`/repos/${this.owner}/${this.repo}/git/trees/${sha}`, {
      recursive: 1
    })
    .then( (tree) => {
      return tree.tree.reduce(function(accum, file) {
        var filename = file.path.split('/').pop();
        var pm = Parsers.findPlatform(file.path);
        if (pm) accum.push({name: pm, path: file.path, sha: file.sha});
        return accum;
      }, []);
    });
  }

  fetchBlobs(manifests) {
    var fetchFiles = manifests.map( (m) => {
      return this.gh.get(`/repos/${this.owner}/${this.repo}/git/blobs/${m.sha}`);
    });
    
    return Promise.all(fetchFiles)
    .then( (blobs) => {
      blobs.forEach( (blob,i) => {
        manifests[i].blob = blob;
      });

      return manifests;
    });
  }

  // Manifests *must* have a blob to parse
  parseBlobs(manifests) {
    var parseDeps = manifests.map( (manifest) => {
      var str = new Buffer(manifest.blob.content, 'base64').toString('utf8');
      return Parsers.parse(manifest.name, str);
    });

    return Promise.all(parseDeps)
    .then( (values) => {
      manifests.forEach( (m,i) => {
        delete m.blob;

        var deps = values[i].reduce( (accum, dep) => {
          accum[dep[0]] = dep[1];
          return accum;
        }, {});

        m.deps = deps;
      });

      return manifests;
    });
  }

  // TODO test, also Dependencies class?
  queryLibraries(manifest) {
    var deps = Object.keys(manifest.deps);
    var fetch = deps.map( (dep) => {
      return this.lib.get(`/api/${manifest.name}/${dep}`);
    });
    
    return Promise.all(fetch)
    .then( (libs) => {
      var _libs = {};
      libs.forEach( (lib,i) => {
        _libs[deps[i]] = lib.latest_release_number;
      });

      return _libs;
    });
  }

  // TODO test, also Dependencies class?
  fetchVersions(manifests) {
    var fetchFiles = manifests.map( (m) => {
      return this.queryLibraries(m);
    });
    
    return Promise.all(fetchFiles)
    .then( (libs) => {
      libs.forEach( (lib,i) => {
        manifests[i].lib = lib;
      });

      return manifests;
    });
  }

}

module.exports = Repo;
