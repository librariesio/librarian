'use strict';

module.exports = {
  index: require('./home'),
  repoInfoV1: require('./repo-info-v1'),
  repoInfoV2: require('./repo-info-v2'),
  parseManifests: require('./parse-manifests'),
  prStatus: require('./pr-status')
};
