/*jshint globalstrict:true, trailing:false, unused:true, node:true */
"use strict";

require("babel/register");

var url = require('url');
var redisInstance = process.env.REDISCLOUD_URL || 'redis://localhost:6379';
var redisURL = url.parse(redisInstance);

var Redis = require("redis");
var redis = Redis.createClient(redisURL.port, redisURL.hostname, {
  no_ready_check: true
});
redis.auth(redisURL.auth.split(":")[1]);

var get = function(key) {
  return new Promise(function(resolve, reject) {
    redis.get(key, function(err, data) {
      return err ? reject(err) : resolve(data);
    });
  });
};

var set = function(key, value) {
  return new Promise(function(resolve, reject) {
    redis.set(key, value, function(err, data) {
      return err ? reject(err) : resolve(data);
    });
  });
};

module.exports = {
  get: get,
  set: set
};
