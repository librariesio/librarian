/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

require("babel/register");

var url = require('url');
var Redis = require("redis");

var _instance = process.env.REDISCLOUD_URL || 'redis://localhost:6379';
var config = url.parse(_instance);

var redis = Redis.createClient(config.port, config.hostname, {
  no_ready_check: true
});
if (config.auth) redis.auth(config.auth.split(":")[1]);

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
