/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

require("babel/register");

var assert = require('assert');
var GitHub = require('../lib/github');
var Repo = require('../lib/repo');
var sinon = require('sinon');
var payloads = require('./fixtures/github-payloads');


describe('Repo class', function(){
  this.timeout(5*1000);

  var gh;
  beforeEach(function() {
    gh = new GitHub();

    var get = sinon.stub();
    get.withArgs('/repos/malditogeek/hooks/branches')
    .returns(Promise.resolve(payloads.branches));  
    get.withArgs('/repos/malditogeek/hooks/git/trees/9611b058b6aaa0481eb77d504f9141f06e9b52ea')
    .returns(Promise.resolve(payloads.tree));  
    get.withArgs('/repos/malditogeek/hooks/git/blobs/5dc0f3906430d87bfe001089e2280b9ee4ac24c5')
    .returns(Promise.resolve(payloads.blob));  

    var stub = sinon.stub(gh, 'get', get);
  });

  it('should fetch manifests', function(done) {
    var repo = new Repo('malditogeek', 'hooks', gh);
    return repo.findManifests()
    .then(function(manifests) {
      var expected = { 
        npm: {
          path: 'package.json',
          mode: '100644',
          type: 'blob',
          sha: '5dc0f3906430d87bfe001089e2280b9ee4ac24c5',
          size: 531,
          url: 'https://api.github.com/repos/malditogeek/hooks/git/blobs/5dc0f3906430d87bfe001089e2280b9ee4ac24c5'
        } 
      };

      assert.deepEqual(manifests, expected);
    })
    .then(done)
    .catch(done);
  });

  it('should find dependencies foo', function(done) {
    var repo = new Repo('malditogeek', 'hooks', gh);
    return repo.findManifests()
    .then(function(manifests) {
      return repo.fetchDependencies(manifests);
    })
    .then(function(dependencies) {
      var expected = {npm: { octonode: '^0.6.15', 'node-gitter': '^1.2.7' }};
      assert.deepEqual(dependencies, expected);
    })
    .then(done)
    .catch(done);
  });

  it('should find dependencies 2', function(done) {
    var repo = new Repo('malditogeek', 'hooks', gh);
    return repo.findDependencies()
    .then(function(dependencies) {
      var expected = {npm: { octonode: '^0.6.15', 'node-gitter': '^1.2.7' }};
      assert.deepEqual(dependencies, expected);
    })
    .then(done)
    .catch(done);
  });


});
