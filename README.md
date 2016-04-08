# chat-codes

[![Build Status](https://img.shields.io/travis/gw2efficiency/chat-codes.svg?style=flat-square)](https://travis-ci.org/gw2efficiency/chat-codes)
[![Coverage Status](https://img.shields.io/codecov/c/github/gw2efficiency/chat-codes/master.svg?style=flat-square)](https://codecov.io/github/gw2efficiency/chat-codes)

> Encode and decode guildwars2 chat codes

## Install

```
npm install gw2e-chat-codes
```

This module can be used for Node.js as well as browsers using [Browserify](https://github.com/substack/browserify-handbook#how-node_modules-works).

## Usage

```js
const chatCodes = require('gw2e-chat-codes')

// Encode a type and id as a chat code
// Valid types are item, text, map, skill, trait, recipe, skin & outfit
let encodedCode = chatCodes.encode('item', 46762)
// -> '[&AgGqtgAA]'

// Decode a chat code into type and id
let decodedCode = chatCodes.decode('[&BtIWAAA=]')
// -> {type: 'skin', id: 5842}
```

## Tests

```
npm test
```

## Licence

MIT

Big thanks to [codemasher](https://github.com/codemasher) & [poke](https://github.com/poke),
who wrote [this algorithm in PHP](https://gist.github.com/codemasher/47dea40f70f990480c5b).
