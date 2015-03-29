/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

require("babel/register");

var fs = require('fs');
var parsers = require('../parsers');

var fn = function(req, res) {
  var files = Object.keys(req.files).map( file => req.files[file] );
  var validFiles = files.filter( file => !file.truncated );
  var parseFiles = validFiles.map( (file) => {
    var platform = parsers.supportedManifests[file.originalname];
    if (!platform) return {};
    file.platform = platform;
    var str = fs.readFileSync(file.path).toString();
    return parsers.parse(platform, str);
  });

  return Promise.all(parseFiles)
  .then( (values) => {
    var output = validFiles.reduce( (accum, file, i) => {
      accum.push({
        file:     file.originalname,
        platform: file.platform,
        packages: values[i]
      });
      return accum;
    }, []);

    res.set('Content-Type', 'application/json; charset=utf-8');
    res.status(200).end(JSON.stringify(output));
  })
  .then( () => {
    validFiles.forEach( (file) => {
      fs.unlink(file.path);
    });
  })
  .catch( (err) => {
    console.log('ERR: parseManifest', err);
    res.render('error');
  });
};

module.exports = fn;
