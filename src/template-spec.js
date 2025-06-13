/* spec.simple-hsl-palette.js – MCP wrapper for “simple-hsl-palette”
 * Accepts flexible inputs for hue/saturation/lightness:
 *   • number          → {min:n, max:n}
 *   • [min,max] array → {min,max}
 *   • {min,max} object (original form)
 */

import { nanoid }          from 'nanoid';
import { z }               from 'zod';
import { generatePalette } from './palette-generator.js';

/* ═════════ helpers ════════════════════════════════════════════════ */
export const makeResult = (v) => ({
  content: [{ type: 'text', text: typeof v === 'string' ? v : JSON.stringify(v, null, 2) }],
});

/* Normalise any accepted form into {min,max} */
const normRange = (raw, label) => {
  if (raw == null) return undefined;
  if (typeof raw === 'number')                        return { min: raw, max: raw };
  if (Array.isArray(raw) && raw.length === 2)         return { min: raw[0], max: raw[1] };
  if (typeof raw === 'object' && 'min' in raw && 'max' in raw) return raw;
  throw new TypeError(`"${label}" must be number, [min,max], or {min,max}`);
};

/* ═════════ Zod shapes ═════════════════════════════════════════════ */
const SingleNum   = z.number();
const NumTuple2   = z.tuple([z.number(), z.number()]);
const RangeObject = z.object({ min: z.number(), max: z.number() });
const RangeUnion  = z.union([SingleNum, NumTuple2, RangeObject]);

const RANGE_DESC =
  'Accepts one of:\n' +
  '• number → fixed value\n' +
  '• [min,max] → inclusive range\n' +
  '• {min,max} → inclusive range';

const PaletteOptsShape = {
  count: z.number().int().min(1).optional()
          .describe('How many colours to return (≥ 1).'),
  hue: RangeUnion.optional().describe(`Hue in degrees (0–360). ${RANGE_DESC}`),
  saturation: RangeUnion.optional().describe(`Saturation in % (0–100). ${RANGE_DESC}`),
  lightness: RangeUnion.optional().describe(`Lightness in % (0–100). ${RANGE_DESC}`),
};

/* ═════════ spec ═══════════════════════════════════════════════════ */
export const spec = {
  id         : 'simple-hsl-palette',
  instanceId : nanoid(),
  description: 'Generate evenly-spaced HSL colour palettes. ' +
               'Hue/Sat/Light inputs may be number, [min,max], or {min,max}.',

  tools: [
    {
      name       : 'generatePalette',
      description: 'Return an array of HSL strings forming a smooth palette.',
      parameters : PaletteOptsShape,
      async execute(args) {
        const opts = {
          ...args,
          hue        : normRange(args.hue,        'hue'),
          saturation : normRange(args.saturation, 'saturation'),
          lightness  : normRange(args.lightness,  'lightness'),
        };
        return makeResult(generatePalette(opts));
      },
    },
  ],
};

export default spec;
