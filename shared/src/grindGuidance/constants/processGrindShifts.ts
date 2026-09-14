/**
 * What the processing does to a grind, as a fraction of the window's
 * half-width. Positive is coarser.
 *
 * Matched on a stem against normalised label text rather than against a closed
 * set, exactly as `PROCESS_SIGNALS` is and for the same reason: `process` is
 * free text in the contract, and a roaster inventing a new name for a
 * fermentation next season must not need a migration. The stems are English
 * and Slovak both, since Slovak roasters print either.
 *
 * Order matters: the first stem that matches wins, so the specific rows come
 * before the general ones they contain. "Anaeróbne natural" is an anaerobic
 * lot rather than a plain natural.
 *
 * The numbers are smaller than the roast table's, which is the honest ranking
 * of the two: how dark a coffee was roasted changes its solubility far more
 * than what was done to the cherry before it. Processing moves a starting
 * point; it does not decide it.
 */
export const PROCESS_GRIND_SHIFTS: readonly (readonly [string, number])[] = [
  /**
   * Fermented under pressure. The most soluble coffees most people ever meet -
   * the fermentation has already broken down what a brew would otherwise have
   * to, so they reach a full extraction sooner than they look like they will.
   */
  ['anaerob', 0.25],
  ['carbonic', 0.25],
  ['macerat', 0.25],
  ['experiment', 0.2],
  /** Indonesia's own method. Low-density beans that give themselves up quickly. */
  ['wet hull', 0.15],
  ['giling', 0.15],
  /** Mucilage left on to dry. Halfway between washed and natural, by design. */
  ['honey', 0.15],
  ['medov', 0.15],
  ['pulped natural', 0.15],
  ['semi wash', 0.1],
  ['polopran', 0.1],
  /** Dried in the fruit: sweeter, more soluble, and muddy when over-extracted. */
  ['natural', 0.2],
  ['dry process', 0.2],
  ['susen', 0.2],
  /** Fruit removed before drying. Dense, clean, and the least forgiving of a coarse grind. */
  ['wash', -0.1],
  ['pran', -0.1],
];
