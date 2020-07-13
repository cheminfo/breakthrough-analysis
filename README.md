# breakthrough-analysis

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![npm download][download-image]][download-url]

Parse and analyze breakthrough experiments.

## Installation

`$ npm i breakthrough-analysis`

## Usage

```js
import BreakthroughCurves from 'breakthrough-analysis';

let breaktroughcurves = BreakthroughCurves.fromHWCSV(file);
let carbondioxide = breakthroughcurves.get('Carbon dioxide vs ms');
```

## [API Documentation](https://cheminfo.github.io/breakthrough-analysis/)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/breakthrough-analysis.svg
[npm-url]: https://www.npmjs.com/package/breakthrough-analysis
[ci-image]: https://github.com/cheminfo/breakthrough-analysis/workflows/Node.js%20CI/badge.svg?branch=master
[ci-url]: https://github.com/cheminfo/breakthrough-analysis/actions?query=workflow%3A%22Node.js+CI%22
[download-image]: https://img.shields.io/npm/dm/breakthrough-analysis.svg
[download-url]: https://www.npmjs.com/package/breakthrough-analysis
