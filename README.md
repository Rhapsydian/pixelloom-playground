# Pixelloom Playground

A tiny, dependency-free demo for [pixelloom](https://github.com/Rhapsydian/pixelloom) ([npm](https://www.npmjs.com/package/pixelloom)) — paint a pixel grid and watch it trace into an optimized SVG path live, including a byte-count comparison against the naive one-`<rect>`-per-pixel equivalent.

**Live:** https://rhapsydian.github.io/pixelloom-playground/

This is a demo, not the library — for the actual boundary-tracing algorithm, see the [pixelloom repo](https://github.com/Rhapsydian/pixelloom).

## How it's built

Plain HTML/CSS/vanilla JS, no framework, no build step. It imports pixelloom directly from a CDN as a native ES module, pinned to a specific version so this demo can't silently break if the library's API changes later:

```js
import { gridToPath, gridToSvg } from 'https://unpkg.com/pixelloom@0.1.0/src/index.js';
```

## Running locally

Opening `index.html` directly (`file://`) won't work — browsers block ES module imports over the `file://` protocol. Serve it instead:

```sh
npm start
```

That runs `npx serve .` and prints a local URL to open.
