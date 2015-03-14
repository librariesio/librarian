/*jshint globalstrict:true, trailing:false, unused:true, node:true */
"use strict";

require("babel/register");

var redis  = require("redis").createClient();

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
