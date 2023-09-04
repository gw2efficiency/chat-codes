# chat-codes

[![Build Status](https://img.shields.io/travis/com/gw2efficiency/chat-codes?style=flat-square)](https://app.travis-ci.com/github/gw2efficiency/chat-codes)
[![Coverage Status](https://img.shields.io/codecov/c/github/gw2efficiency/chat-codes/master.svg?style=flat-square)](https://codecov.io/github/gw2efficiency/chat-codes)

> Encode and decode Guild Wars2 chat codes

*This is part of [gw2efficiency](https://gw2efficiency.com). Please report all issues in [the central repository](https://github.com/gw2efficiency/issues/issues).*

## Install

```
npm install gw2e-chat-codes
```

This module can be used for Node.js as well as browsers using [Browserify](https://github.com/substack/browserify-handbook#how-node_modules-works).

## Usage

```js
const { encode, decode } = require('gw2e-chat-codes')

// Encode a type and id as a chat code
// Valid types are item, map, skill, trait, recipe, skin, outfit & objective
let encodedSkill = encode('skill', 5842)
// -> '[&BtIWAAA=]'

// You can pass an object as second parameter to also encode quantity, skin or upgrades
let encodedItem = encode('item', {id: 46762, quantity: 10, skin: 5807, upgrades: [24554, 24615]})
// -> '[&AgGqtgDgrxYAAOpfAAAnYAAA]'

// Decode a chat code into type and id
let decodedCode = decode('[&BtIWAAA=]')
// -> {type: 'skin', id: 5842}
```

## Tests

```
npm test
```

## Licence

MIT

Big thanks to [codemasher](https://github.com/codemasher) & [poke](https://github.com/poke),
who wrote [this algorithm in PHP](https://gist.github.com/codemasher/47dea40f70f990480c5b), and 
[darthmaim](https://github.com/darthmaim) who wrote most of the build template link code.
