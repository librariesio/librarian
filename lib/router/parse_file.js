var Parsers = require('librarian-parsers');

module.exports = function(req, res, next) {
  var filepath = req.query.filepath;
  var contents = req.body.contents;
  var platform = Parsers.findPlatform(filepath);
  var dependencies = platform.parser(contents)

  res.set('Content-Type', 'application/json; charset=utf-8');

  return res.send(dependencies);
}
