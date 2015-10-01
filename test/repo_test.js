require("babel/register");

var assert = require('assert');
var GitHub = require('../lib/github');
var Repo = require('../lib/repo');
var parsers = require('../lib/parsers').parsers;
var sinon = require('sinon');
var payloads = require('./fixtures/github-payloads');

describe('Repo class', function(){

  var GH, EXPECTED_PATH, EXPECTED_SHA;

  beforeEach(function() {

    // Stub GH API

    GH = new GitHub();

    var get = sinon.stub();
    get.withArgs('/repos/malditogeek/hooks/branches')
    .returns(Promise.resolve(payloads.branches));
    get.withArgs('/repos/malditogeek/hooks/git/trees/9611b058b6aaa0481eb77d504f9141f06e9b52ea')
    .returns(Promise.resolve(payloads.tree));
    get.withArgs('/repos/malditogeek/hooks/git/blobs/5dc0f3906430d87bfe001089e2280b9ee4ac24c5')
    .returns(Promise.resolve(payloads.blob));
    get.withArgs('/repos/malditogeek/hooks')
    .returns(Promise.resolve(payloads.repo));
    get.withArgs('/repos/malditogeek/hooks/branches/master')
    .returns(Promise.resolve(payloads.master_branch));

    sinon.stub(GH, 'get', get);

    // Sample repo manifest

    EXPECTED_PATH = 'package.json';
    EXPECTED_SHA  = '5dc0f3906430d87bfe001089e2280b9ee4ac24c5';
  });

  it('should fetch default_branch HEAD', function(done) {
    var repo = new Repo('malditogeek', 'hooks', GH);
    return repo.fetchDefaultBranch()
    .then(function(sha) {
      assert.equal(sha, '9611b058b6aaa0481eb77d504f9141f06e9b52ea', "Diff sha");
    })
    .then(done)
    .catch(done);
  });

  it('should find manifests at a given SHA', function(done) {
    var repo = new Repo('malditogeek', 'hooks', GH);

    var expected = [
      {
        path: 'package.json',
        sha: '5dc0f3906430d87bfe001089e2280b9ee4ac24c5',
        platform: parsers.npm
      }
    ];

    return repo.findManifestsAt('9611b058b6aaa0481eb77d504f9141f06e9b52ea')
    .then(function(manifests) {
      assert.deepEqual(manifests, expected, "Manifests don't match");
    })
    .then(done)
    .catch(done);
  });

  it('should fetch blobs given a manifest', function(done) {

    var input = [
      {
        path: 'package.json',
        sha: '5dc0f3906430d87bfe001089e2280b9ee4ac24c5',
        platform: parsers.npm,
      }
    ];

    var expected = [
      {
        path: 'package.json',
        sha: '5dc0f3906430d87bfe001089e2280b9ee4ac24c5',
        platform: parsers.npm,
        blob: payloads.blob
      }
    ];

    var repo = new Repo('malditogeek', 'hooks', GH);
    return repo.fetchBlobs(input)
    .then(function(blobs) {
      assert.deepEqual(blobs, expected, "Blobs don't match");
    })
    .then(done)
    .catch(done);
  });

  it('should be able to parse blobs', function(done) {

    var input = [
      {
        path:         EXPECTED_PATH,
        sha:          EXPECTED_SHA,
        platform:     parsers.npm,
        blob:         payloads.blob,
      }
    ];

    var expected = [
      {
        path:         EXPECTED_PATH,
        sha:          EXPECTED_SHA,
        platform:     parsers.npm,
        blob:         payloads.blob,
        dependencies: [
          {name: 'octonode', version: '^0.6.15', type: 'runtime'},
          {name: 'node-gitter', version: '^1.2.7', type: 'runtime'}
        ]
      }
    ];


    var repo = new Repo('malditogeek', 'hooks', GH);
    return repo.parseBlobs(input)
    .then(function(parsed) {
      assert.deepEqual(parsed, expected, "Deps don't match");
    })
    .then(done)
    .catch(done);
  });

  it('should find dependencies', function(done) {

    var expected = [
      {
        platform:     parsers.npm.name,
        type:         parsers.npm.type,
        filepath:     EXPECTED_PATH,
        parserName:   'npm',
        sha:          EXPECTED_SHA,
        dependencies: [
          {name: 'octonode', version: '^0.6.15', type: 'runtime'},
          {name: 'node-gitter', version: '^1.2.7', type: 'runtime'}
        ]
      }
    ];

    var repo = new Repo('malditogeek', 'hooks', GH);
    return repo.findDependencies()
    .then(function(dependencies) {
      assert.deepEqual(dependencies, expected, "Deps don't match");
    })
    .then(done)
    .catch(done);
  });

  it('should find metadata', function(done) {
    var repo = new Repo('malditogeek', 'hooks', GH);
    return repo.findMetadata()
    .then(function(metadata) {
      assert.deepEqual(Object.keys(metadata), ['readme'], "Missing metadata");
    })
    .then(done)
    .catch(done);
  });


});
