var request = require('request');
var crypto = require('crypto');

function OAuth(opts) {
  this.client   = opts.client;
  this.secret   = opts.secret;
  this.redirect = opts.redirect;
  this.scope    = opts.scope;
  this.state    = crypto.randomBytes(8).toString('hex');
};

OAuth.prototype.login = function(req, res) {
  var u = 'https://github.com/login/oauth/authorize'
      + '?client_id=' + this.client
      + '&scope=' + this.scope
      + '&redirect_uri=' + this.redirect
      + '&state=' + this.state;

  res.statusCode = 302;
  res.setHeader('Location', u);
  res.end();
};

OAuth.prototype.callback = function(req, res, next) {
  var code = req.query.code
  if (!code) return res.render('error')

  var u = 'https://github.com/login/oauth/access_token'
      + '?client_id=' + this.client
      + '&client_secret=' + this.secret
      + '&code=' + code
      + '&state=' + this.state;

  request.get({url:u, json: true}, function(err, _, body) {
    if (err || body.error) return res.render('error');
    req.token = body.access_token;
    next();
  });
};

module.exports = OAuth;
