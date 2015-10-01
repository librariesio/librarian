'use strict';

require("babel/register");

var express      = require('express');
var bodyParser   = require('body-parser');
var serve_static = require('serve-static');
var session      = require('cookie-session');
var memwatch     = require('memwatch-next');
var bugsnag      = require('bugsnag');
var debug        = require('debug')('librarian');
var router       = require('./lib/router');


var app = express();
var isProduction = app.get('env') === 'production';
var port = process.env.PORT || 5000;

// Middlewares
if (isProduction) {
  bugsnag.register("b9d5d0c5b9ecdcf14731645900d4f5be");
  app.use(bugsnag.requestHandler);
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'jade');
app.use(serve_static('static'));
app.use(session({secret: 'teprefieroigualinternacional'}));
app.disable('x-powered-by');

app.use(function(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

// Routes
app.get('/', router.index);

app.get('/repos/:owner/:repo', router.repoInfoV1);
app.get('/v2/repos/:owner/:repo', router.repoInfoV2);

app.get('/repos/:owner/:repo/pull/:pr', router.prStatus);

// File uploads parser
//var multer = require('multer');
//app.post('/manifests', [multer({dest: './uploads/'}), router.parseManifests]);

// Error handling
if (isProduction) app.use(bugsnag.errorHandler);
app.use(function(err, req, res, next) {
  console.error('ERR', err);
  console.error('STACK:', err.stack);
  res.status(500).send({error: 'Something went wrong.'});
});

app.listen(port, function() {
  console.log('Listening on', port);

  memwatch.on('leak', function(info) { 
    console.log('leak:', info);
  });
  
  //memwatch.on('stats', function(stats) {
  //  console.log('stats:', stats);
  //});
  
  setInterval(memwatch.gc, 60000);
});
