# node-repeat-checker

A simple and light repeat operation checker.

## Getting Start

```js
const { MemoryChecker } = require('repeat-checker');

const checker = new MemoryChecker();

function () {
  if (!checker.checkAndSet('somekey', 1000)) {
    throw new Error('must call it after 1 second');
  }

  // some codes.
}
```

## License

The project was published under MIT license.
