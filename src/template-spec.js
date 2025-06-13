/* spec.simple-hsl-palette.js  – MCP wrapper for “simple-hsl-palette” */

import { nanoid } from 'nanoid';
import { z }      from 'zod';
import { generatePalette } from './palette-generator.js';

/*───────── helpers ───────────────────────────────────────────────────*/
export const makeResult = (v) => ({
  content: [
    {
      type: 'text',
      text: typeof v === 'string' ? v : JSON.stringify(v, null, 2),
    },
  ],
});

/*───────── parameter shapes ──────────────────────────────────────────*/
const RangeShape = {
  min: z.number().describe('Inclusive lower bound.'),
  max: z.number().describe('Inclusive upper bound.'),
};

const PaletteOptionsShape = {
  count      : z.number().int().min(1).describe('Number of colours (≥ 1)').optional(),
  hue        : z.object(RangeShape).describe('Hue range in degrees (0 – 360)').optional(),
  saturation : z.object(RangeShape).describe('Saturation range in % (0 – 100)').optional(),
  lightness  : z.object(RangeShape).describe('Lightness range in % (0 – 100)').optional(),
};

/*───────── spec object ───────────────────────────────────────────────*/
export const spec = {
  id         : 'simple-hsl-palette',
  instanceId : nanoid(),
  description: 'Generate evenly spaced HSL colour palettes.',

  tools: [
    /* TOOL: generatePalette -----------------------------------------*/
    {
      name       : 'generatePalette',
      description: 'Return an array of HSL strings forming a smooth palette.',
      parameters : PaletteOptionsShape,
      async execute(opts) {
        return makeResult(generatePalette(opts));
      },
    },
  ],
};

export default spec;
