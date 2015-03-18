/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

require("babel/register");

var GitHub = require('../github');
var redis  = require('../redis');
var debug  = require('debug')('librarian');

var PORT    = process.env.PORT || 5000;
var BASEURL = process.env.HOST || 'http://localhost:' + PORT;

module.exports = function(req, res) {
  var repo = req.body.repo;

  return redis.get(req.session.user)
  .then(function(token) {
    var gh = new GitHub(token);

    var user = req.session.user;
    var webhook_url = BASEURL + '/webhooks/' + user;

    var body = {
      name: 'web',
      active: 'true',
      events: ['push', 'pull_request'],
      config: {
        url: webhook_url,
        content_type: 'json'
      }
    };

    return gh.post('/repos/' + repo + '/hooks', null, body);
  })
  .then(function() {
    res.redirect(302, '/repos');
  })
  .catch(function(err) {
    res.end('ERR:', err);
    console.log(err.stack);
  });
};
