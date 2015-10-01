'use strict';

var Redis = require('ioredis');
var url = require('url');

var cfg = url.parse(process.env.REDISCLOUD_URL || 'redis://localhost:6379');

var redis = new Redis({
  host: cfg.hostname,
  port: cfg.port,
  password: cfg.auth ? cfg.auth.split(':')[1] : null
});

module.exports = redis;
