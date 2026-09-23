import type { TileGlyph } from '../../../components/ui';
import type { TextTone } from '../../../components/ui';
import type { ColorPalette } from '../../../theme';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';
import { GRINDER_PRECISIONS, type GrinderPrecision } from '../services/grinderPrecision';

/** The sentence that keeps an estimate from reading like a measurement. */
export const GRINDER_PRECISION_LABEL_KEYS: Record<GrinderPrecision, TranslationKey> = {
  [GRINDER_PRECISIONS.measured]: TRANSLATION_KEYS.grinderPrecisionMeasured,
  [GRINDER_PRECISIONS.estimated]: TRANSLATION_KEYS.grinderPrecisionEstimated,
  [GRINDER_PRECISIONS.missing]: TRANSLATION_KEYS.grinderPrecisionMissing,
};

/**
 * A glyph beside the words, because colour alone is not a statement.
 *
 * The same rule the cupboard's freshness line already follows: somebody who
 * cannot tell this app's green from its ochre still has to be able to tell a
 * curve somebody measured from one the catalogue inferred, and a micron
 * figure reads like a fact whatever colour it is printed in.
 *
 * Each glyph names the kind of argument rather than grading it - an
 * instrument, an approximation, a question - which is the one job an icon has
 * anywhere in this app.
 */
export const GRINDER_PRECISION_ICONS = {
  [GRINDER_PRECISIONS.measured]: 'ruler',
  [GRINDER_PRECISIONS.estimated]: 'approximately-equal',
  [GRINDER_PRECISIONS.missing]: 'help-circle-outline',
} as const satisfies Record<GrinderPrecision, TileGlyph>;

/**
 * An estimate is warned about, a missing curve is merely stated, and a
 * measured one is quiet - the interface should not congratulate itself.
 */
export const GRINDER_PRECISION_TONES = {
  [GRINDER_PRECISIONS.measured]: 'secondary',
  [GRINDER_PRECISIONS.estimated]: 'tertiary',
  [GRINDER_PRECISIONS.missing]: 'muted',
} as const satisfies Record<GrinderPrecision, TextTone>;

/**
 * The same three decisions as a palette key, because an icon takes a colour
 * where a `Text` takes a role. Keeping the pair in one file is what stops the
 * two halves of one line landing on different greens.
 */
export const GRINDER_PRECISION_ICON_COLORS = {
  [GRINDER_PRECISIONS.measured]: 'secondary',
  [GRINDER_PRECISIONS.estimated]: 'tertiary',
  [GRINDER_PRECISIONS.missing]: 'onSurfaceVariant',
} as const satisfies Record<GrinderPrecision, keyof ColorPalette>;
