'use strict';

module.exports = {
  index: require('./home'),
  webhooks: require('./webhooks'),
  prStatus: require('./pr-status'),
  createWebhook: require('./create-webhook'),
  repoInfo: require('./repo-info'),
  subscribe: require('./subscribe'),
  parseManifests: require('./parse-manifests')
};
