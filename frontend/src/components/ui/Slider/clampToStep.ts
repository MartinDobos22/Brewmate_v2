export interface StepRange {
  readonly min: number;
  readonly max: number;
  readonly step: number;
}

/** Snaps a raw value onto the step grid and keeps it inside the range. */
export const clampToStep = (value: number, { min, max, step }: StepRange): number => {
  const stepped = min + Math.round((value - min) / step) * step;

  return Math.min(max, Math.max(min, stepped));
};

/** Where a value sits in its range, as 0..1. */
export const toRatio = (value: number, { min, max }: StepRange): number => {
  const span = max - min;

  return span === 0 ? 0 : (value - min) / span;
};

/** The value at a 0..1 position of the track. */
export const fromRatio = (ratio: number, range: StepRange): number =>
  clampToStep(range.min + ratio * (range.max - range.min), range);
