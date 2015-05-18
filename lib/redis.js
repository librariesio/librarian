'use strict';

var url = require('url');
var Redis = require("redis");

var cfg = url.parse(process.env.REDISCLOUD_URL || 'redis://localhost:6379');
var redis = Redis.createClient(cfg.port, cfg.hostname);
if (cfg.auth) redis.auth(cfg.auth.split(":")[1]);

var commands = ['get', 'set'];

module.exports = commands.reduce(function(accum, cmd) {
  accum[cmd] = function() {
    var args = [[].splice.call(arguments,0)];
    return new Promise(function(resolve, reject) {
      args.push( (err, data) => err ? reject(err) : resolve(data) );
      redis[cmd].apply(redis, args);
    });
  };
  return accum;
}, {});
