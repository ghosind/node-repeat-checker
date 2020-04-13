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

## Supported Storages

|  Name  |  Status  |
|:------:|:--------:|
| Memory |    √     |
| Redis  | Coming soon |

## Contribution

1. Fork the Project.
2. Create your Branch. (`git checkout -b features/someFeatures`)
3. Make your features.
4. Create test cases for your features if need.
5. Run `npm test` to validate your code.
6. Run `npm run lint` to check and fix code styles.
7. Commit your Changes. (`git commit -m 'Add some features'`)
8. Push to the Branch. (`git push origin features/someFeatures`)
9. Create a new Pull Request.

## License

The project was published under MIT license.
