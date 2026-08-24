import type { AttributeInsight, InsightAttribute } from '@brewmate/shared';

import { INSIGHT_ATTRIBUTE_ORDER } from './insightLabelKeys';

/** One heading and the values under it, already ranked by the API. */
export interface InsightGroup {
  readonly attribute: InsightAttribute;
  readonly values: readonly AttributeInsight[];
}

const NOTHING = 0;

/**
 * Splits the flat list the API sends into the three sections the screen shows.
 *
 * Flat over the wire because the ranking is the API's and one list cannot
 * disagree with itself; grouped here because a reader asks three separate
 * questions of it. A section with nothing in it is dropped rather than drawn
 * empty - somebody who has never written down a processing method should not
 * be shown a heading with a blank under it.
 */
export const groupInsightsByAttribute = (
  attributes: readonly AttributeInsight[],
): readonly InsightGroup[] =>
  INSIGHT_ATTRIBUTE_ORDER.map((attribute: InsightAttribute): InsightGroup => ({
    attribute,
    values: attributes.filter(
      (insight: AttributeInsight): boolean => insight.attribute === attribute,
    ),
  })).filter((group: InsightGroup): boolean => group.values.length > NOTHING);
