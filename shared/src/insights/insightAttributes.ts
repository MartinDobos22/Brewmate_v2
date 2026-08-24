/**
 * The three things a coffee is described by that a history can be counted
 * over.
 *
 * Origin, process and roast level, and deliberately nothing else. A variety or
 * a farm names too few bags for a count to mean anything, and a tasting note
 * is the roaster's opinion rather than a fact about the bean - it is read
 * separately, as evidence about flavour, not ranked as a thing somebody
 * "brews".
 */
export const INSIGHT_ATTRIBUTES = {
  origin: 'origin',
  process: 'process',
  roastLevel: 'roast_level',
} as const;

export type InsightAttribute = (typeof INSIGHT_ATTRIBUTES)[keyof typeof INSIGHT_ATTRIBUTES];

/**
 * Why the app thinks a profile should move.
 *
 * Machine names, translated by the app, for the same reason the conversion
 * report is: the arithmetic and the sentence beside it cannot then drift
 * apart, and adding a reason is a type error at the place that has to explain
 * it.
 */
export const INSIGHT_REASON_KINDS = {
  roastHistory: 'roast_history',
  flavorNotes: 'flavor_notes',
} as const;

export type InsightReasonKind = (typeof INSIGHT_REASON_KINDS)[keyof typeof INSIGHT_REASON_KINDS];

/**
 * Who wrote the sentence beside the numbers.
 *
 * The numbers are the same either way - they are arithmetic over the brew logs.
 * This says whether a model put them into Slovak or the phone did, which is
 * the same admission the shop verdict makes when it falls back to its rules.
 */
export const INSIGHT_EXPLANATION_SOURCES = {
  model: 'model',
  rules: 'rules',
} as const;

export type InsightExplanationSource =
  (typeof INSIGHT_EXPLANATION_SOURCES)[keyof typeof INSIGHT_EXPLANATION_SOURCES];
