/*jshint globalstrict:true, trailing:false, unused:true, node:true */
"use strict";

require("babel/register");

var bodyParser  = require('body-parser');
var express     = require('express');
var app         = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var webhook = require('./lib/webhook');

app.post('/webhook', webhook);

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log('Listening on', port);
});
