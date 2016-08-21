var express      = require('express');
var bodyParser   = require('body-parser');
var bugsnag      = require('bugsnag');
var debug        = require('debug')('librarian');
var repoInfoV2   = require('./lib/router/repo-info-v2')

var app = express();
var isProduction = app.get('env') === 'production';
var port = process.env.PORT || 5000;

// Middlewares
if (isProduction) {
  bugsnag.register(process.env.BUGSNAG);
  app.use(bugsnag.requestHandler);
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.disable('x-powered-by');

app.use(function(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/v2/repos/:owner/:repo', repoInfoV2);

// Error handling
if (isProduction) app.use(bugsnag.errorHandler);
app.use(function(err, req, res, next) {
  console.error('ERR:', err);
  console.error('STACK:', err.stack);
  res.status(500).send({error: 'Something went wrong.'});
});

app.listen(port, function() {
  console.log('Listening on', port);
});
