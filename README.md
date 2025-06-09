# simple-hsl-palette

> Tiny zero-dependency helper for procedural **HSL** colour palettes.

---

## Install

```bash
npm i simple-hsl-palette
# or
yarn add simple-hsl-palette
```

## Quick Start

```js
import { generatePalette } from 'simple-hsl-palette';

const colours = generatePalette({
  count      : 8,                       // number of swatches
  hue        : { min: 180, max: 240 },  // 0–360°  (blue-green band)
  saturation : { min: 60,  max: 90 },   // 0–100 %
  lightness  : { min: 35,  max: 65 },   // 0–100 %
});

console.log(colours);
// ['hsl(192, 72%, 42%)', 'hsl(221, 79%, 63%)', …]
```

## API

```
generatePalette(options?) → string[]
Option	Type	Default	Description
count	number	5	Number of swatches (≥ 1).
hue	{ min:number, max:number }	{0,360}	Hue range in degrees.
saturation	{ min:number, max:number }	{50,100}	Saturation range in %.
lightness	{ min:number, max:number }	{30,70}	Lightness range in %.

All ranges are inclusive. Inputs are clamped to their valid domains.

The function returns an array of hsl(h, s%, l%) strings ready for CSS or any colour-aware API.
```
