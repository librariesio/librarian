'use strict';

var Promise = require('bluebird');
var memjs = require('memjs');

var servers =  process.env.MEMCACHEDCLOUD_SERVERS || '127.0.0.1:11211';
var username = process.env.MEMCACHEDCLOUD_USERNAME;
var password = process.env.MEMCACHEDCLOUD_PASSWORD;

var client = memjs.Client.create(servers, {
  username: username,
  password: password
});

// init connection?
client.set('foo', 'bar', function(err, data) {
  client.get('foo', function(err, data) {
  });
});

module.exports = {
  get: Promise.promisify(client.get, client),
  set: Promise.promisify(client.set, client)
};
