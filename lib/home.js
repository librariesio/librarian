/*jshint globalstrict:true, trailing:false, unused:true, node:true */
"use strict";

require("babel/register");

var home = function(req, res) {
  res.render('home');
};

module.exports = home;
