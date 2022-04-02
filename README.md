# simple-timeout

Simple, intuitive, timeout library. Easy to use, not a simple promise wrapper, not overloaded with fancy utilities.

[![TypeScript version][ts-badge]][typescript-4-6]
[![Node.js version][nodejs-badge]][nodejs]
[![MIT][license-badge]][license]
[![Build Status - GitHub Actions][gha-badge]][gha-ci]


## Getting Started

```shell
npm install simple-timeout
```

## Usage

```typescript
// Initialization
const timeout = new Timeout(5000);

// On trigger
timeout.subscribe().then(() => {
  // your code here
})

// Clear
timeout.clear()
```

### Timeout options

```typescript
const timeout = new Timeout(5000, timeoutOptions)
```

- timeoutMessage (optional) : System Out message when timeout is triggered.
- callbackFn (optional): Callback function called when the timeout is triggered. 
  `status` and `timeoutMessage` are accessible via the arguments of the callback function.
```typescript
const timeout = new Timeout(5000, {
  callbackFn: ({ status, timeoutMessage }) => {
    // Your code here
  }
})

const timeout_two = new Timeout<number>(2000, (args) => (args.status === 'triggered') ? 1 : 2);
```
- nullSubscription (optional): Setting it to true make the `timeout.subscribe()` return `null`
    when the timeout is cleared.

> Note: When you provide the `callbackFn` in the `timeoutOptions`,
    it internally subscribes to the promise and provides the callback function to the `then`
    block. It is a shorthand for `timeout.subscribe().then(() => {})`

### Timeout Status

```typescript
Status = 'unset' | 'set' | 'cleared' | 'triggered'

console.log(timeout.status) // Gives the current status of the timeout 
```
- `unset` is the default state.
- Timeout status is switched to `set` when it is initialized.
- `triggered`is set when the timeout is triggered.
- `cleared` is set when timeout is cleared.

### Timeout Subscribe

```typescript
timeout.subscribe()
  .then(({status, timeoutMessage}) => {
  // your code here
})
```
Returns a promise wrapper on `setTimeout`.

### Timeout Clear

```typescript
timeout.clear() 
// OR
timeout.clear(({status, timeoutMessage}) => {})
```
Clears the timeout. It takes an optional callback function as an argument.

## Motivation

The idea for the library came about while I was working on a data gathering project that relies on scraping. For normal usage 
Puppeteer timeouts would suffice, but I kept on running into some advanced cases where I had to use native timeouts. Unfortunately,
managing the native timeouts was a pain in the a** to deal with. Hence, this `simple-timeout` was the solution to the problem I was facing.
I decided to separate it from the main project and make it into a library when I had other use cases for it. ***This library will be maintained
as long as it's parent project is maintained.***

## PRs are welcome
Feel free to raise Issues and PRs addressing bugfixes. I don't plan for this project to be too bloated with features.

## License

Licensed under the MIT. See the [LICENSE](https://github.com/bloodred17/simple-timeout/blob/main/LICENSE) file for details.

[ts-badge]: https://img.shields.io/badge/TypeScript-4.6-blue.svg
[nodejs-badge]: https://img.shields.io/badge/Node.js->=%2016.13-blue.svg
[nodejs]: https://nodejs.org/dist/latest-v14.x/docs/api/
[gha-badge]: https://github.com/jsynowiec/node-typescript-boilerplate/actions/workflows/nodejs.yml/badge.svg
[gha-ci]: https://github.com/jsynowiec/node-typescript-boilerplate/actions/workflows/nodejs.yml
[typescript]: https://www.typescriptlang.org/
[typescript-4-6]: https://devblogs.microsoft.com/typescript/announcing-typescript-4-6/
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg
[license]: https://github.com/bloodred17/better-timeout/blob/main/LICENSE
[sponsor-badge]: https://img.shields.io/badge/♥-Sponsor-fc0fb5.svg
[jest]: https://facebook.github.io/jest/
[eslint]: https://github.com/eslint/eslint
[wiki-js-tests]: https://github.com/jsynowiec/node-typescript-boilerplate/wiki/Unit-tests-in-plain-JavaScript
[prettier]: https://prettier.io
[volta]: https://volta.sh
[volta-getting-started]: https://docs.volta.sh/guide/getting-started
[volta-tomdale]: https://twitter.com/tomdale/status/1162017336699838467?s=20
[gh-actions]: https://github.com/features/actions
[repo-template-action]: https://github.com/jsynowiec/node-typescript-boilerplate/generate
[esm]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
[sindresorhus-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
[dynamic-import]: https://v8.dev/features/dynamic-import