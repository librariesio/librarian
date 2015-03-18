/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

require("babel/register");

var GitHub = require('../github');
var redis  = require('../redis');
var debug  = require('debug')('librarian');

var PORT    = process.env.PORT || 5000;
var BASEURL = process.env.HOST || 'http://localhost:' + PORT;

module.exports = function(req, res) {

  var user = req.session.user;
  var url = BASEURL + '/webhooks/' + user;

  return redis.get(req.session.user)
  .then(function(token) {
    var gh = new GitHub(token);
    var q = {per_page: 50, type: 'owner', sort: 'pushed', direction: 'desc'};
    return gh.get('/user/repos', q);
  })
  .then(function(repos) {
    res.render('repos', {repos: repos, webhook: url});
  })
  .catch(function(err) {
    res.end('ERR:', err);
    console.log(err.stack);
  });
};
