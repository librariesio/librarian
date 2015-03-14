/*jshint globalstrict:true, trailing:false, unused:true, node:true */
"use strict";

require("babel/register");

var PORT    = process.env.PORT || 5000;
var BASEURL = process.env.HOST || 'http://localhost:' + PORT;

var express       = require('express');
var bodyParser    = require('body-parser');
var serve_static  = require('serve-static');
var octonode      = require('octonode');
var redis         = require('./lib/redis');
var debug         = require('debug')('librarian');
var webhooks      = require('./lib/webhooks');
var prStatus      = require('./lib/pr-status');
var OAuth         = require('./lib/oauth');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'jade');
app.use(serve_static('static'));

var gh = new OAuth({
  client:   process.env.GHCLIENT,
  secret:   process.env.GHSECRET,
  redirect: BASEURL + '/github/callback',
  scope:    'repo:status'
});

app.get('/github/login',    gh.login.bind(gh));
app.get('/github/callback', gh.callback.bind(gh), function(req, res) {
  var client = octonode.client(req.token);
  client.me().info(function(err, me) {
    redis.set(me.login, req.token)
    .then(function() {
      var url = BASEURL + '/webhooks/' + me.login;
      res.render('welcome', {username: me.login, url: url});
    });
  });
});

app.post('/webhooks/:username', webhooks);
app.get('/repos/:owner/:repo/pull/:pr', prStatus);

app.listen(PORT, function() {
  debug('Listening on', PORT);
});
