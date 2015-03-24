/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

require("babel/register");

var debug = require('debug')('librarian');
var https = require('https');
var qs    = require('qs');

var Client = function(token) {
  this.token = token;
};

['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].forEach(function(method) {
  Client.prototype[method.toLowerCase()] = function(path, query, body) {
    return this.request(method, path, query, body);
  };
});

Client.prototype.request = function(method, path, query, body) {

  var headers = {
    'User-Agent'    : 'GitHub Client',
    'Accept'        : 'application/json'
  };

  if (this.token) headers['Authorization'] = `token ${this.token}`;
  if (body) headers['Content-Type'] = 'application/json';

  var options = {
    hostname: 'api.github.com',
    port:     443,
    method:   method,
    path:     query ? path + '?' + qs.stringify(query) : path,
    headers:  headers
  };

  return new Promise(function(resolve, reject) {
    var responseHandler = function(res) {
      debug('Remaining: ' + res.headers['x-ratelimit-remaining']);

      res.setEncoding('utf8');

      var data = '';
      res.on('data', function(chunk) { data += chunk; });

      res.on('end', function() { resolve(JSON.parse(data)); });

      debug('GH: ' + res.statusCode + ' ' + method + ' ' + options.path);

      if ([200,201].indexOf(res.statusCode) === -1) {
        return reject(new Error(res.statusCode));
      }
    };

    var req = https.request(options, responseHandler);
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

module.exports = Client;
