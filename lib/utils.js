/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

var SUPPORTED = {
  'package.json': 'npm',
  'Gemfile':      'rubygems'
};

var detectManifests = function(files) {
  return files.reduce(function(accum, file) {
    var filename = file.path.split('/').pop();
    var pm = SUPPORTED[filename];
    if (pm) accum[pm] = file;
    return accum;
  }, {});
};

module.exports = {
  detectManifests: detectManifests
};
