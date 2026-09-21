import { INSIGHT_ATTRIBUTES, type InsightAttribute } from '@brewmate/shared';

import type { TileGlyph } from '../../../components/ui';
import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

/**
 * The Slovak word for each attribute the report counts.
 *
 * Total over the contract's own set, so adding an attribute to the API is a
 * type error here rather than a machine name printed on somebody's screen -
 * the same rule the conversion report and the error codes follow.
 */
export const INSIGHT_ATTRIBUTE_LABEL_KEYS: Record<InsightAttribute, TranslationKey> = {
  [INSIGHT_ATTRIBUTES.origin]: TRANSLATION_KEYS.insightsAttributeOrigin,
  [INSIGHT_ATTRIBUTES.process]: TRANSLATION_KEYS.insightsAttributeProcess,
  [INSIGHT_ATTRIBUTES.roastLevel]: TRANSLATION_KEYS.insightsAttributeRoastLevel,
};

/** The order the report is read in: where it came from, what was done to it, how it was roasted. */
export const INSIGHT_ATTRIBUTE_ORDER: readonly InsightAttribute[] = [
  INSIGHT_ATTRIBUTES.origin,
  INSIGHT_ATTRIBUTES.process,
  INSIGHT_ATTRIBUTES.roastLevel,
];

/**
 * A glyph per section, beside its name.
 *
 * The section headings are set as eyebrows - small and tracked out - so three
 * of them down a screen read as three quiet lines rather than as three
 * questions. The mark is what turns each back into the subject of the card
 * under it: where it came from, what was done to it, how it was roasted.
 */
export const INSIGHT_ATTRIBUTE_ICONS: Record<InsightAttribute, TileGlyph> = {
  [INSIGHT_ATTRIBUTES.origin]: 'earth',
  [INSIGHT_ATTRIBUTES.process]: 'water-outline',
  [INSIGHT_ATTRIBUTES.roastLevel]: 'fire',
};
