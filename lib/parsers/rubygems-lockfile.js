'use strict';

// Source: https://github.com/bundler/bundler/blob/master/lib/bundler/lockfile_parser.rb#L134-L137

var NAME_VERSION = '(?! )(.*?)(?: \(([^-]*)(?:-(.*))?\))?';
var NAME_VERSION_2 = new RegExp(`^ {2}${NAME_VERSION}(!)?$`);
var NAME_VERSION_4 = new RegExp(`^ {4}${NAME_VERSION}$`);
var NAME_VERSION_6 = new RegExp(`^ {6}${NAME_VERSION}$`);

var lockfile = function(str) {
  if (!str) return [];

  var deps = str.split('\n').reduce( (accum, line) => {
    var match = line.match(NAME_VERSION_4);
    if (!match) return accum;

    var name = match[1];
    var version = match[2].replace(/\(|\)/g,'');
    accum.push([name, version]);
    return accum;
  }, []);

  return deps;
};

module.exports = lockfile;
