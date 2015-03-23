/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

var branches = [ 
  { name: 'alpha',
    commit:
     { sha: '1b3341acf23ec1bb3d2bc2fec438c164edf3bd9a',
       url: 'https://api.github.com/repos/malditogeek/hooks/commits/1b3341acf23ec1bb3d2bc2fec438c164edf3bd9a' } },
  { name: 'markdown',
    commit:
     { sha: '1e2d1bd915a26dd9ee3d69469a40df751b6913f2',
       url: 'https://api.github.com/repos/malditogeek/hooks/commits/1e2d1bd915a26dd9ee3d69469a40df751b6913f2' } },
  { name: 'master',
    commit:
     { sha: '9611b058b6aaa0481eb77d504f9141f06e9b52ea',
       url: 'https://api.github.com/repos/malditogeek/hooks/commits/9611b058b6aaa0481eb77d504f9141f06e9b52ea' } },
  { name: 'nochange',
    commit:
     { sha: '8f913cf6786275b7dc209ca20c375de59e309a0a',
       url: 'https://api.github.com/repos/malditogeek/hooks/commits/8f913cf6786275b7dc209ca20c375de59e309a0a' } },
  { name: 'nochanges',
    commit:
     { sha: '38d2ca65bc7b1ac2e02aca909e7d30202de2961f',
       url: 'https://api.github.com/repos/malditogeek/hooks/commits/38d2ca65bc7b1ac2e02aca909e7d30202de2961f' } },
  { name: 'somechanges',
    commit:
     { sha: '612dbb5399ac98a24ce53384226a74d78b958f9f',
       url: 'https://api.github.com/repos/malditogeek/hooks/commits/612dbb5399ac98a24ce53384226a74d78b958f9f' } },
  { name: 'sweet-feature',
    commit:
     { sha: '0ae919592989b846a67e75dda8cf1fd66cdaf552',
       url: 'https://api.github.com/repos/malditogeek/hooks/commits/0ae919592989b846a67e75dda8cf1fd66cdaf552' } } 
];

var tree = {
  sha: '9611b058b6aaa0481eb77d504f9141f06e9b52ea',
  url: 'https://api.github.com/repos/malditogeek/hooks/git/trees/9611b058b6aaa0481eb77d504f9141f06e9b52ea',
  tree:
   [ { path: '.gitignore',
       mode: '100644',
       type: 'blob',
       sha: 'c2658d7d1b31848c3b71960543cb0368e56cd4c7',
       size: 14,
       url: 'https://api.github.com/repos/malditogeek/hooks/git/blobs/c2658d7d1b31848c3b71960543cb0368e56cd4c7' },
     { path: 'README.md',
       mode: '100644',
       type: 'blob',
       sha: 'c6fed82998c288bad6f662492d58675a424bed17',
       size: 10,
       url: 'https://api.github.com/repos/malditogeek/hooks/git/blobs/c6fed82998c288bad6f662492d58675a424bed17' },
     { path: 'package.json',
       mode: '100644',
       type: 'blob',
       sha: '5dc0f3906430d87bfe001089e2280b9ee4ac24c5',
       size: 531,
       url: 'https://api.github.com/repos/malditogeek/hooks/git/blobs/5dc0f3906430d87bfe001089e2280b9ee4ac24c5' } ],
  truncated: false 
};

var blob = { sha: '5dc0f3906430d87bfe001089e2280b9ee4ac24c5',
    size: 531,
    url: 'https://api.github.com/repos/malditogeek/hooks/git/blobs/5dc0f3906430d87bfe001089e2280b9ee4ac24c5',
    content: 'ewogICJuYW1lIjogImhvb2tzIiwKICAidmVyc2lvbiI6ICIxLjAuMCIsCiAg\nImRlc2NyaXB0aW9uIjogIisiLAogICJtYWluIjogImluZGV4LmpzIiwKICAi\nZGVwZW5kZW5jaWVzIjogewogICAgIm9jdG9ub2RlIjogIl4wLjYuMTUiLAog\nICAgIm5vZGUtZ2l0dGVyIjogIl4xLjIuNyIKICB9LAogICJkZXZEZXBlbmRl\nbmNpZXMiOiB7fSwKICAic2NyaXB0cyI6IHsKICAgICJ0ZXN0IjogImVjaG8g\nXCJFcnJvcjogbm8gdGVzdCBzcGVjaWZpZWRcIiAmJiBleGl0IDEiCiAgfSwK\nICAicmVwb3NpdG9yeSI6IHsKICAgICJ0eXBlIjogImdpdCIsCiAgICAidXJs\nIjogImh0dHBzOi8vZ2l0aHViLmNvbS9tYWxkaXRvZ2Vlay9ob29rcy5naXQi\nCiAgfSwKICAiYXV0aG9yIjogIiIsCiAgImxpY2Vuc2UiOiAiSVNDIiwKICAi\nYnVncyI6IHsKICAgICJ1cmwiOiAiaHR0cHM6Ly9naXRodWIuY29tL21hbGRp\ndG9nZWVrL2hvb2tzL2lzc3VlcyIKICB9LAogICJob21lcGFnZSI6ICJodHRw\nczovL2dpdGh1Yi5jb20vbWFsZGl0b2dlZWsvaG9va3MiCn0K\n',
    encoding: 'base64' 
};

module.exports = {
  branches: branches,
  tree: tree,
  blob: blob
};
