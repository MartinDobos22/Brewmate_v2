const NOTHING = 0;
const HALF = 0.5;

/** One figure, and how much the cup it came from is worth. */
export interface WeightedValue {
  readonly value: number;
  readonly weight: number;
}

const byValue = (left: WeightedValue, right: WeightedValue): number => left.value - right.value;

/**
 * The figure half of the weight sits either side of.
 *
 * A median rather than a mean, because habits are lumpy: somebody who brews
 * at 1:16 every weekday and tried 1:12 twice for a guest has a habit of 1:16,
 * and a mean would report a ratio they have never once brewed. Weighted, so a
 * cup made with everything to hand counts for more than one made at a cabin.
 *
 * @returns null when nothing carries any weight - an empty median is not a
 * middle, it is an absence.
 */
export const weightedMedian = (values: readonly WeightedValue[]): number | null => {
  const counted = values.filter((entry: WeightedValue): boolean => entry.weight > NOTHING);
  const total = counted.reduce(
    (sum: number, entry: WeightedValue): number => sum + entry.weight,
    NOTHING,
  );

  if (total <= NOTHING) {
    return null;
  }

  let running = NOTHING;

  for (const entry of [...counted].sort(byValue)) {
    running += entry.weight;

    if (running >= total * HALF) {
      return entry.value;
    }
  }

  return null;
};
