/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

require("babel/register");

var GitHub = require('../github');
var Repo   = require('../repo');
var Lib    = require('../libraries');

module.exports = function(req, res) {
  var repoID = req.query.repo;
  var token = req.query.token;
  var user = req.query.user;

  var gh = new GitHub(token);
  var repo = new Repo(repoID, gh);

  repo.findDependencies()
    .then( (manifests) => {
      var packages = manifests.reduce( (a,m) => {
        a[m.name] = Object.keys(m.deps);
        return a;
      }, {});

      var body =  {
        user: user,
        repository_id: repoID,
        packages: packages
      };

      var lib = new Lib();
      return lib.post('/api/manifests/update', null, body);
    })
    .then( () => {
      res.json({});
    })
    .catch( (err) => {
      console.log(err.stack);
      res.render('error');
    });
};
