# Runtime — third-party provenance

## backlot-liquid-glass.js

The displacement-map generator and the edge-masked chromatic-aberration SVG
filter graph are adapted from:

- **rdev/liquid-glass-react** — MIT © 2025 Max Rovensky
  https://github.com/rdev/liquid-glass-react
- which adapts the per-pixel rounded-rect-SDF displacement technique from
  **shuding/liquid-glass** — MIT © 2025 Shu Ding
  https://github.com/shuding/liquid-glass

What we kept: the Canvas-2D displacement-map generation (`shader-utils.ts`) and
the three-pass RGB `feDisplacementMap` filter with the radial edge mask
(`GlassFilter` in `src/index.tsx`).

What we dropped: the React component shell, pointer tracking, and hover spring
animation — Backlot surfaces are deterministic and render frame-by-frame.

Both upstream projects are MIT licensed; the MIT permission notice below covers
the adapted portions.

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
