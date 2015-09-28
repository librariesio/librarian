'use strict';

var Promise = require('bluebird');
var Parsers = require('./parsers');

class Repo {
  constructor(owner, repo, gh) {
    this.owner = owner;
    this.repo = repo;
    this.gh = gh;
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
    })
    .then( (manifests) => {
      return manifests.reduce( (accum, manifest) => {
        let data =  {
          platform: manifest.platform.name,
          type: manifest.platform.type,
          filepath: manifest.path,
          sha: manifest.sha,
          dependencies: manifest.dependencies
        };
        accum.push(data);
        return accum;
      }, []);
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
        var pm = Parsers.findPlatform(file.path);
        if (pm) accum.push({platform: pm, path: file.path, sha: file.sha});
        return accum;
      }, []);
    });
  }

  findMetadata(sha) {
    var fetchSHA = sha ? Promise.resolve(sha) : this.fetchDefaultBranch();

    return fetchSHA
    .then( (sha) => {
      return this.gh.get(`/repos/${this.owner}/${this.repo}/git/trees/${sha}`, {
        recursive: 1
      });
    })
    .then( (tree) => {
      return tree.tree.reduce(function(accum, file) {
        //console.log('file', file);
        if (file.path.match(/^README/i)) accum['readme'] = file;
        if (file.path.match(/^CHANGELOG/i)) accum['changelog'] = file;
        if (file.path.match(/^CONTRIBUTING/i)) accum['contributing'] = file;
        if (file.path.match(/^LICENSE/i)) accum['license'] = file;
        if (file.path.match(/^CODE[-_]OF[-_]CONDUCT/i)) accum['codeofconduct'] = file;
        if (file.path.match(/^THREAT[-_]MODEL/i)) accum['threatmodel'] = file;

        return accum;
      }, {});
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
      //return Parsers.parse(manifest.platform.name, str);
      return manifest.platform.parser(str);
    });

    return Promise.all(parseDeps)
    .then( (values) => {
      manifests.forEach( (m,i) => {
        m.dependencies= values[i];
      });

      return manifests;
    });
  }
}

module.exports = Repo;
