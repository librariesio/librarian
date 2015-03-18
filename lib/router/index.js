/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

module.exports = {
  index: require('./home'),
  repos: require('./repos'),
  webhooks: require('./webhooks'),
  prStatus: require('./pr-status'),
  createWebhook: require('./create-webhook')
};
