import type { Grinder } from '@brewmate/shared';

import { formatDecimal } from '../../../lib/formatters';

const RANGE_SEPARATOR = ' – ';
const PART_SEPARATOR = ' · ';
const STEPLESS = 0;

/**
 * The one line under a catalogue entry: what its collar counts in, how far it
 * goes, and how finely it moves.
 *
 * The labels arrive already translated, because the numbers are the only part
 * this function is allowed to know about.
 */
export const formatGrinderSettings = (
  grinder: Grinder,
  labels: { readonly unit: string; readonly step: string; readonly stepless: string },
): string => {
  const range = `${formatDecimal(grinder.minSetting)}${RANGE_SEPARATOR}${formatDecimal(grinder.maxSetting)}`;
  const step =
    grinder.step === STEPLESS ? labels.stepless : `${labels.step} ${formatDecimal(grinder.step)}`;

  return `${labels.unit}${PART_SEPARATOR}${range}${PART_SEPARATOR}${step}`;
};
