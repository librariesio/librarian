'use strict';

var Redis = require('ioredis');
var cfg = process.env.REDIS_URL || 'redis://localhost:6379';
var redis = new Redis(cfg);

module.exports = redis;
