/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

require("babel/register");

var assert = require('assert');
var GitHub = require('../lib/github');
var Repo = require('../lib/repo');
var sinon = require('sinon');
var payloads = require('./fixtures/github-payloads');

describe('Repo class', function(){

  var gh, hooksManifest;

  beforeEach(function() {

    // Stub GH API

    gh = new GitHub();

    var get = sinon.stub();
    get.withArgs('/repos/malditogeek/hooks/branches')
    .returns(Promise.resolve(payloads.branches));  
    get.withArgs('/repos/malditogeek/hooks/git/trees/9611b058b6aaa0481eb77d504f9141f06e9b52ea')
    .returns(Promise.resolve(payloads.tree));  
    get.withArgs('/repos/malditogeek/hooks/git/blobs/5dc0f3906430d87bfe001089e2280b9ee4ac24c5')
    .returns(Promise.resolve(payloads.blob));  

    sinon.stub(gh, 'get', get);

    // Sample repo manifest

    hooksManifest = [{
      name: 'npm',
      path: 'package.json',
      sha: '5dc0f3906430d87bfe001089e2280b9ee4ac24c5'
    }];

  });

  it('should fetch master HEAD', function(done) {
    var repo = new Repo('malditogeek', 'hooks', gh);
    return repo.fetchMaster()
    .then(function(sha) {
      assert.equal(sha, '9611b058b6aaa0481eb77d504f9141f06e9b52ea', "Diff sha");
    })
    .then(done)
    .catch(done);
  });

  it('should find manifests at a given SHA', function(done) {
    var repo = new Repo('malditogeek', 'hooks', gh);
    return repo.findManifestsAt('9611b058b6aaa0481eb77d504f9141f06e9b52ea')
    .then(function(manifests) {
      assert.deepEqual(manifests, hooksManifest, "Manifests don't match");
    })
    .then(done)
    .catch(done);
  });

  it('should fetch blobs given a manifest', function(done) {
    hooksManifest[0].blob = payloads.blob;

    var repo = new Repo('malditogeek', 'hooks', gh);
    return repo.fetchBlobs(hooksManifest)
    .then(function(blobs) {
      assert.deepEqual(blobs, hooksManifest, "Blobs don't match");
    })
    .then(done)
    .catch(done);
  });

  it('should be able to parse blobs', function(done) {
    hooksManifest[0].blob = payloads.blob;
    hooksManifest[0].deps = {octonode: '^0.6.15', 'node-gitter': '^1.2.7'};

    var repo = new Repo('malditogeek', 'hooks', gh);
    return repo.parseBlobs(hooksManifest)
    .then(function(deps) {
      delete hooksManifest.blob;
      assert.deepEqual(deps, hooksManifest, "Deps don't match");
    })
    .then(done)
    .catch(done);
  });

  it('should find dependencies', function(done) {
    hooksManifest[0].deps = {octonode: '^0.6.15', 'node-gitter': '^1.2.7'};

    var repo = new Repo('malditogeek', 'hooks', gh);
    return repo.findDependencies()
    .then(function(dependencies) {
      assert.deepEqual(dependencies, hooksManifest, "Deps don't match");
    })
    .then(done)
    .catch(done);
  });

});
