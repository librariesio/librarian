'use strict';

var debug = require('debug')('gh-client');
var qs    = require('qs');
var parseLink = require('parse-link-header');
var rp = require('request-promise');
var cache = require('./memcache');
var Promise = require('bluebird');

var TTL = 60  * 60 * 24; // one day

class Client {
  constructor(token, opts) {
    opts = opts || {};
    this.token = token;
    this.host = opts.host || 'api.github.com';
    this.ghclient = opts.ghclient || process.env.GHCLIENT;
    this.ghsecret = opts.ghsecret || process.env.GHSECRET;
  }

  get(path, query) {
    query = query || {};

    return this.request('GET', path, query)
    .then( (res) => {
      if (!query.allPages) return res.body;

      var pages = parseLink(res.headers.link);
      var lastPage = parseInt(pages.last.page);

      var page = 1;
      var requests = [];
      while (page < lastPage) {
        page += 1;
        query.page = page;
        requests.push(this.request('GET', path, query));
      }

      // Fetch all pages concurrently
      return Promise.all(requests)
      .then( (values) => {
        return values.reduce( (accum, page) => {
          return accum.concat(page.body);
        }, res.body);
      });
    });
  }

  prepareOptions(method, path, query, body) {
    path = encodeURI(path);
    query = query || {};

    var headers = {
      'User-Agent':   'GitHub Client',
      'Accept':       'application/vnd.github.moondragon+json',
      'Content-Type': 'application/json'
    };

    if (this.token) {
      headers.Authorization = `token ${this.token}`;
    } else {
      query.client_id = this.ghclient;
      query.client_secret = this.ghsecret;
    }
    
    var hasQuery = !!Object.keys(query).length;
    if (hasQuery) path = `${path}?${qs.stringify(query)}`;

    var uri = `https://${this.host}${path}`;

    var opts = {
      method:   method,
      host:     this.host,
      path:     path,
      uri:      uri,
      headers:  headers,
      json:     true,
      resolveWithFullResponse: true
    };

    return opts;
  }

  request(method, path, query) {
    query.page = query.page || 1;
    query.per_page = query.per_page || 100;

    var opts = this.prepareOptions(method, path, query);

    // Generate a hash for the request
    var hash = `${opts.path}:${this.token}`;

    // Fetch etag and use it if present
    return cache.get(`res:${hash}`)
    .spread( (res, extras) => {
      if (res) {
        res = JSON.parse(res);
        opts.headers['If-None-Match'] = res.headers.etag;
      }
      return rp(opts);
    })

    // If we get 200, process and cache the response
    .then( (res) => {

      var response = {
        headers: res.headers,
        body:    res.body
      };

      return cache.set(`res:${hash}`, JSON.stringify(response))
      .then( () => response);
    })

    // If we don't get a 200, check if it's a 304 cache hit
    .catch( (err) => {
      if (err.statusCode !== 304) throw err;

      return cache.get(`res:${hash}`)
      .spread( (cached, extras) => JSON.parse(cached) );

    });
  }
}

module.exports = Client;
