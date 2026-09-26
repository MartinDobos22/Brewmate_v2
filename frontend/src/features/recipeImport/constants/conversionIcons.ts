import { CONVERSION_PRECISIONS, type ConversionNote } from '@brewmate/shared';

import type { TileGlyph } from '../../../components/ui';

/** The marks on the card that says how much each converted number is worth. */
export const CONVERSION_ICONS = {
  report: 'scale-balance',
  grind: 'grain',
} as const satisfies Record<string, TileGlyph>;

/**
 * How a number was arrived at, as a glyph.
 *
 * It classifies and never grades, which is why none of the three is a tick or
 * a cross: `exact` came across untouched or is arithmetic that cannot be
 * wrong, `estimated` is a real calculation over approximate inputs, `unknown`
 * means the original never said. An estimate is not a failure - it is the
 * honest answer to a question the source did not answer.
 */
export const CONVERSION_PRECISION_ICONS = {
  [CONVERSION_PRECISIONS.exact]: 'equal',
  [CONVERSION_PRECISIONS.estimated]: 'approximately-equal',
  [CONVERSION_PRECISIONS.unknown]: 'help-circle-outline',
} as const satisfies Record<ConversionNote['precision'], TileGlyph>;
