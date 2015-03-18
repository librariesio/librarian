/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

require("babel/register");

module.exports = function(req, res) {
  res.render('home');
};
