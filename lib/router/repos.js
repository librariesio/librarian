/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

require("babel/register");

var GitHub = require('../github');
var Lib    = require('../libraries');
var redis  = require('../redis');
var debug  = require('debug')('librarian');

module.exports = function(req, res) {
  var user = req.session.user;

  return redis.get(req.session.user)
  .then(function(token) {
    var lib = new Lib();
    var gh = new GitHub(token);
    var q = {per_page: 50, type: 'all', sort: 'pushed', direction: 'desc'};

    return Promise.all([
      gh.get('/user/repos', q), 
      lib.get(`/api/manifests?user=${user}`)
    ]);
  })
  .then(function(values) {
    var repos = values[0];
    var subscriptions = values[1].reduce( (accum, sub) => {
      accum[sub.name] = true;
      return accum;
    }, {});

    repos.forEach( (repo) => {
      if (subscriptions[`github.com/${repo.full_name}`]) {
        repo.tracked = true;
      }
    });
      
    res.render('repos', {repos: repos});
  })
  .catch(function(err) {
    res.end('ERR:', err);
    console.log(err.stack);
  });
};
