# Libraries CI

http://ci.libraries.io

## Getting started

Make sure you have the right engine installed, check the `.nvmrc`

```
$> nvm use
$> DEBUG=* npm start
```

Requests should include a valid GitHub `token` but export GHCLIENT and GHSECRET env vars or you'll get throttled very quicky for requests that don't include one.
