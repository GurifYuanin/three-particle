# [Three-particle](https://github.com/GurifYuanin/three-particle)
[![](https://img.shields.io/badge/Powered%20by-three%20particle-brightgreen.svg)](https://github.com/GurifYuanin/three-particle)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/GurifYuanin/three-particle/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/GurifYuanin/three-particle.svg?branch=master)](https://travis-ci.org/GurifYuanin/three-particle)
[![npm](https://img.shields.io/badge/npm-6.9.0-orange.svg)](https://www.npmjs.com/package/three-particle)
[![NPM downloads](http://img.shields.io/npm/dm/three-particle.svg?style=flat-square)](http://www.npmtrends.com/three-particle)
[![Percentage of issues still open](http://isitmaintained.com/badge/open/GurifYuanin/three-particle.svg)](http://isitmaintained.com/project/GurifYuanin/three-particle "Percentage of issues still open")

A [three.js](https://github.com/mrdoob/three.js) based particle script to create particle system easily and efficiently.

## Compatibility
Unit tests guarantee support on the following environment:

| IE   | CH   | FF   | SF   | OP   | IOS  | Android   | Node  |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ----- |
| 6+   | 29+  | 55+  | 9+   | 50+  | 9+   | 4+   | 4+    |

> Note: Compiling code depend on ES5, so you need import [es5-shim](http://github.com/es-shims/es5-shim/) to compatible with `IE6-8`, here is a [demo](./demo/demo-global.html)

## Directory
```
├── demo - Using demo
├── dist - Compiler output code
├── doc - Project documents
├── src - Source code directory
├── server - Start a local server when dev
├── test - Unit tests
├── CHANGELOG.md - Change log
└── TODO.md - Planned features
```

## Demo
You can view example on [Github page](https://gurifyuanin.github.io/three-particle/demo/) !

## Usage

Using npm, download and install the code. 

```bash
$ npm install --save three three-particle
```

For webpack or similar environment：

```js
import * as THREE from 'three'; // based lib
import TP from 'three-particle';

// same as three.js
// create renderer, scene, camera, etc...
const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// what you really need to do
// create particle system by three-particle
const emitter = new TP.ExplosionEmitter();
const sphere = new TP.Sphere();
emitter.addParticle(sphere);
scene.add(emitter);

(function render() {
    requestAnimationFrame(render);
    emitter.update(); // if not, particles will not be updated
    renderer.render(scene, camera);
})();
```

For requirejs environment:

```js
requirejs(['node_modules/three-particle/dist/index.aio.js'], function (TP) {
    // do something...
})
```

For browser environment:

```html
<script src="node_modules/three-particle/dist/index.aio.js"></script>
```

## Documents
+ [API](./doc/api.md)

## Contribution Guide

How to switch `JS` and `TS`

- `srctype` and `scripts` in `package.json`
- `require` file of `test/test.js`
- `require` file of `test/browser/index.html`

For the first time to run, you need to install dependencies firstly.

```bash
$ npm install
```

To develop the project:
```bash
$ npm run dev
```

You can start up a local server to load some static resource (eg: font, img) when using font-loader or image-texture.
Then visit `localhost:1234` in your browser.
```bash
$ npm run serve
```

To build the project:

```bash
$ npm run build
```

To run unit tests:

```bash
$ npm test
```

> Note: The browser environment needs to be tested manually under ```test/browser```

Modify the version number in package.json, modify the version number in README.md, modify the CHANGELOG.md, and then release the new version.

```bash
$ npm run release
```

Publish the new version to NPM.

```bash
$ npm publish
```

### Warning
Please don't update npm package `rollup-plugin-typescript2`, or you will get an error.
```shell
[!] Error: Entry module cannot be external
```

## Contributors

[contributors](https://github.com/GurifYuanin/three-particle/graphs/contributors)

## Change Log
[CHANGELOG.md](./CHANGELOG.md)

## TODO
[TODO.md](./TODO.md)

## Current Users


## Relative links

- [typescript-library-template](https://github.com/jiumao-fe/typescript-library-template)
- [jslib-base](https://github.com/yanhaijing/jslib-base)
