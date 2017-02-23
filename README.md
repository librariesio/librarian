# [Librarian](https://libraries.io/github/librariesio/librarian)
[![Build Status](https://travis-ci.org/librariesio/librarian.svg?branch=master)](https://travis-ci.org/librariesio/librarian)
[![Dependency Status](https://david-dm.org/librariesio/librarian.svg?theme=shields.io)](https://david-dm.org/librariesio/librarian)
[![devDependency Status](https://david-dm.org/librariesio/librarian/dev-status.svg?theme=shields.io)](https://david-dm.org/librariesio/librarian#info=devDependencies)
[![Gitter chat](http://img.shields.io/badge/gitter-librariesio/support-brightgreen.svg)](https://gitter.im/librariesio/support)
[![license](https://img.shields.io/github/license/librariesio/librarian.svg)](https://github.com/librariesio/librarian/blob/master/LICENSE.txt)
[![Docker Automated build](https://img.shields.io/docker/automated/librariesio/librarian.svg)](https://hub.docker.com/r/librariesio/librarian/)

:warning: This repository has been replaced with [Bibliothecary](https://github.com/librariesio/bibliothecary) and will not be updated anymore :warning:

Dependency manifest parsing web service for [Libraries.io](https://libraries.io)

## Install

```bash
git clone https://github.com/librariesio/librarian.git
npm install -g yarn
yarn install
```

## Getting started

Make sure you have the right engine installed, check the `.nvmrc`

```
$> nvm use
$> npm start
```

Requests should include a valid GitHub `token` but export GHCLIENT and GHSECRET env vars or you'll get throttled very quicky for requests that don't include one.

## Development

Source hosted at [GitHub](http://github.com/librariesio/librarian).
Report Issues/Feature requests on [GitHub Issues](http://github.com/librariesio/librarian/issues).

### Note on Patches/Pull Requests

 * Fork the project.
 * Make your feature addition or bug fix.
 * Add tests for it. This is important so I don't break it in a future version unintentionally.
 * Send me a pull request. Bonus points for topic branches.

## License

Copyright (c) 2017 Andrew Nesbitt, Licensed under GNU Affero General Public License. See [LICENSE](https://github.com/librariesio/librarian/blob/master/LICENSE.txt) for details.
