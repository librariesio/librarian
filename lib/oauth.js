/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

var https = require('https');
var crypto = require('crypto');
var qs = require('qs');
var express = require('express');
var redis = require('./redis');
var GitHub = require('./github');

var PORT      = process.env.PORT || 5000;
var BASEURL   = process.env.HOST || 'http://localhost:' + PORT;
var CLIENT    = process.env.GHCLIENT;
var SECRET    = process.env.GHSECRET;
var REDIRECT  = BASEURL + '/github/callback';

var request = function(url) {
  return new Promise(function(resolve, reject) {
    https.get(url, function(res) {
      res.on('data', function(data) {
        var body = qs.parse(data.toString());
        resolve(body);
      });
    })
    .on('error', reject)
    .end();
  });
};

var login = function(req, res) {
  req.session.state = crypto.randomBytes(8).toString('hex');

  var scope = req.query.scope === 'repo' ? 'repo' : 'public_repo';

  var url = 'https://github.com/login/oauth/authorize' 
          + '?client_id=' + CLIENT
          + '&scope=' + scope
          + '&redirect_uri=' + REDIRECT
          + '&state=' + req.session.state;

  res.statusCode = 302;
  res.setHeader('Location', url);
  res.end();
};

var callback = function(req, res) {
  var code = req.query.code;
  if (!code) return res.render('error');

  var url = 'https://github.com/login/oauth/access_token'
          + '?client_id=' + CLIENT
          + '&client_secret=' + SECRET
          + '&code=' + code
          + '&state=' + req.session.state;

  request(url)
  .then(function(response) {
    var token = response.access_token;
    var gh = new GitHub(token);
    gh.get('/user')
    .then(function(user) {
      req.session.user = user.login;
      return redis.set(user.login, token);
    })
    .then(function() {
      res.redirect(302, '/repos');
    });
  })
  .catch(function(err) {
    res.render('error');
  });
};

var logout = function(req, res) {
  req.session.destroy();
  res.redirect('/');
};

var app = express();

app.get('/login',    login);
app.get('/callback', callback);
app.get('/logout',   logout);

module.exports = app;
