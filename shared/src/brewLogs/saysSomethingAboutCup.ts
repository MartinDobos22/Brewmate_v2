import type { CupReading } from './cupReadingSchema.js';

/** Whether a reading carries anything - a message that was not about the cup carries nothing. */
export const saysSomethingAboutCup = (
  reading: CupReading | null | undefined,
): reading is CupReading =>
  reading !== null &&
  reading !== undefined &&
  (reading.extraction !== null || reading.strength !== null);
