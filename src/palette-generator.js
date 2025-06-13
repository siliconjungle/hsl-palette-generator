export * from './palette-generator.js';

// src/palette-generator.js
/*───────────────────────────────────────────────────────────────────────────*\
  SIMPLE-HSL-PALETTE
  A tiny, zero-dependency helper for procedural colour ramps.

  ──────────────────────────────  USAGE  ────────────────────────────────────
  import { generatePalette } from 'simple-hsl-palette';

  // smooth ramp of 8 colours,
  // shifting hue from 180→240 and lightness from 35→65
  const colors = generatePalette({
    count      : 8,
    hue        : { min: 180, max: 240 },
    saturation : { min: 60,  max: 90 },
    lightness  : { min: 35,  max: 65 },
  });

  → [
    'hsl(180, 60%, 35%)',
    'hsl(191, 67%, 40%)',
    'hsl(203, 72%, 45%)',
    'hsl(214, 77%, 50%)',
    'hsl(225, 83%, 55%)',
    'hsl(236, 88%, 60%)',
    'hsl(240, 90%, 65%)'
  ]
\*──────────────────────────────────────────────────────────────────────────*/

/**
 * @typedef {{min:number, max:number}} Range
 * Range with inclusive `min` / `max`.
 *
 * @typedef {Object} PaletteOptions
 * @property {number} [count=5]            How many colours (≥ 1).
 * @property {Range}  [hue]                Hue range in degrees (0–360).
 * @property {Range}  [saturation]         Saturation range in %   (0–100).
 * @property {Range}  [lightness]          Lightness range in %   (0–100).
 */

/**
 * Generate an evenly spaced HSL ramp.
 *
 * @param {PaletteOptions} opts
 * @return {string[]} Array of `hsl(h, s%, l%)` strings.
 */
export function generatePalette(opts = {}) {
  const {
    count      = 5,
    hue        = { min: 0,   max: 360 },
    saturation = { min: 50,  max: 100 },
    lightness  = { min: 30,  max: 70 },
  } = opts;

  if (count < 1) {
    throw new RangeError('`count` must be at least 1');
  }

  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const lerp  = (a, b, t) => a + (b - a) * t;

  const palette = [];
  for (let i = 0; i < count; i++) {
    const t = count > 1 ? i / (count - 1) : 0;

    const h = clamp(lerp(hue.min,        hue.max,        t), 0, 360);
    const s = clamp(lerp(saturation.min, saturation.max, t), 0, 100);
    const l = clamp(lerp(lightness.min,  lightness.max,  t), 0, 100);

    palette.push(
      `hsl(${h.toFixed(0)}, ${s.toFixed(0)}%, ${l.toFixed(0)}%)`
    );
  }

  return palette;
}

/* CommonJS support ------------------------------------------------------ */
if (typeof module !== 'undefined') {
  module.exports = { generatePalette };
}
