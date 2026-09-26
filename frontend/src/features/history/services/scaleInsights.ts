import type { AttributeInsight } from '@brewmate/shared';

const NOTHING = 0;
const SHORTEST = 1;

/**
 * The largest count anywhere in the report, which every bar is drawn against.
 *
 * One scale for the whole screen rather than one per section, because the
 * sections are read one after another and fourteen washed coffees really is a
 * bigger number than nine Ethiopian ones. Scaled per section, the top row of
 * every card would reach the same end and three unrelated shelves would look
 * equally well evidenced - which is the one thing this screen must not say.
 *
 * Never zero, so a report with nothing in it cannot divide by it.
 */
export const readInsightScale = (attributes: readonly AttributeInsight[]): number =>
  Math.max(
    SHORTEST,
    ...attributes.map((insight: AttributeInsight): number => insight.brewCount),
    NOTHING,
  );
