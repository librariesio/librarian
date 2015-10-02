'use strict';

var Promise = require('bluebird');
var memjs = require('memjs');

var servers =  process.env.MEMCACHEDCLOUD_SERVERS || '127.0.0.1:11211';
var username = process.env.MEMCACHEDCLOUD_USERNAME;
var password = process.env.MEMCACHEDCLOUD_PASSWORD;

console.log('memcached servers: ', servers);
console.log('memcached username: ', username);
console.log('memcached password: ', password);


var client = memjs.Client.create(servers, {
  username: username,
  password: password
});

client.set('foo', 'bar', function(err, data) {
  console.log('set: ', data);
  client.get('foo', function(err, data) {
    console.log('get: ', data.toString());
  });
});

module.exports = {
  get: Promise.promisify(client.get, client),
  set: Promise.promisify(client.set, client)
};
