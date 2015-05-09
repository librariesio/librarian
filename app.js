/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

require("babel/register");

var express      = require('express');
var bodyParser   = require('body-parser');
var serve_static = require('serve-static');
var session      = require('cookie-session');
var multer       = require('multer');
var bugsnag      = require('bugsnag');
var debug        = require('debug')('librarian');
var router       = require('./lib/router');
var ghauth       = require('./lib/oauth');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
  extended: true 
}));
app.set('view engine', 'jade');
app.use(serve_static('static'));
app.use(session({
  secret: 'teprefieroigualinternacional'
}));
app.disable('x-powered-by');

bugsnag.register("b9d5d0c5b9ecdcf14731645900d4f5be");

var authed = function(req, res, next) {
  return req.session.user ? next() : res.redirect('/');
};

// GitHub OAuth
//app.use('/github', ghauth);

app.get('/', router.index);

app.get('/repos/:owner/:repo', router.repoInfo);
app.get('/repos/:owner/:repo/pull/:pr', router.prStatus);

app.post('/webhooks/:username', router.webhooks);
app.post('/webhooks', router.createWebhook);
app.post('/subscribe', router.subscribe);
app.post('/manifests', [multer({dest: './uploads/'}), router.parseManifests]);

var port = process.env.PORT || 5000;
app.listen(port, function() {
  debug('Listening on', port);
});
