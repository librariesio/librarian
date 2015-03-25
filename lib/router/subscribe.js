/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

require("babel/register");

var GitHub = require('../github');
var redis  = require('../redis');
var Repo   = require('../repo');
var Lib    = require('../libraries');

module.exports = function(req, res) {
  var repoName = req.body.repo;
  var owner = repoName.split('/')[0];
  var name  = repoName.split('/')[1];

  return redis.get(owner)
  .then( (token) => {
    var gh = new GitHub(token);
    var repo = new Repo(owner, name, gh);

    return repo.findDependencies()
    .then( (manifests) => {
      var packages = manifests.reduce( (a,m) => {
        a[m.name] = Object.keys(m.deps);
        return a;
      }, {});

      var body =  {
        user: owner,
        name: `github.com/${repoName}`,
        packages: packages
      };

      var lib = new Lib();
      return lib.post('/api/manifests/update', null, body);
    })
    .then( () => {
      res.redirect(`/repos/${repoName}`);
    });
  })
  .catch( (err) => {
    console.log(err.stack);
    res.render('error');
  });
};
