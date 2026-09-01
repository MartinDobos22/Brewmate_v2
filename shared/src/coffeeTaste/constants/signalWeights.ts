/**
 * How far each kind of evidence about a coffee is trusted.
 *
 * These are the whole argument of this module, so they are written down once,
 * here, with the reason next to each.
 *
 * The ordering is not negotiable and comes from what actually moves a cup.
 * Roast level moves a coffee further than anything else on the label - a dark
 * Ethiopian and a light Ethiopian are further apart than a light Ethiopian and
 * a light Kenyan - so it outweighs origin. Printed tasting notes are the
 * roaster's own statement about this specific lot, having tasted it, which is
 * better evidence than any generalisation about a country; they are held just
 * below roast only because they are marketing as well as description.
 * Everything else is a prior about a population that this bag is one member
 * of, and the further down this list, the wider that population is.
 */
export const SIGNAL_WEIGHTS = {
  /**
   * What was done to the beans after picking. Second only to roast, and on a
   * light roast arguably first: washed and natural are two different drinks
   * made from the same cherries.
   */
  process: 0.85,
  /**
   * The roaster tasted this lot and wrote down what they found. The single
   * most specific thing on most bags.
   */
  tastingNotes: 0.8,
  /**
   * The strongest single driver, and the one thing most bags actually print.
   */
  roastLevel: 0.9,
  /**
   * A country is a wide population with real tendencies. Worth having and
   * never worth much on its own - "Brazília" covers everything from a
   * chocolate-heavy commodity lot to a competition natural.
   */
  origin: 0.5,
  /**
   * Density, and through it acidity and structure. A real physical effect,
   * but one that the roast can bury entirely.
   */
  altitude: 0.4,
  /**
   * Genetics. Enormously predictive where it is a distinctive variety and
   * nearly meaningless where it is not, which is why the table only names the
   * ones that actually differ.
   */
  variety: 0.45,
} as const;

/**
 * How much accumulated evidence amounts to knowing an axis of a coffee.
 *
 * Lower than the ceiling the taste profile uses, and deliberately so: a
 * profile is built from somebody answering about themselves over months,
 * while everything knowable about a bag is printed on it. A label naming its
 * roast, its process and its notes has said most of what it is ever going to,
 * and the estimate should be allowed to say so.
 */
export const FULL_COFFEE_AXIS_EVIDENCE = 2.2;

/**
 * How far apart two signals about the same axis have to be before they cancel.
 *
 * The same figure the questionnaire uses, and for the same reason: three
 * points of average deviation on a ten-point scale is two pieces of evidence
 * describing different drinks. A dark-roasted Ethiopian natural is exactly
 * that case - the origin and the process argue for a bright fruity cup and the
 * roast argues for a heavy bitter one - and the honest answer is that the
 * label does not settle it.
 */
export const MAX_COFFEE_SIGNAL_DISAGREEMENT = 3;
