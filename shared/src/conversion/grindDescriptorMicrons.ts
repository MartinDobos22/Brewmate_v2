import { GRIND_MICRONS_MAX, GRIND_MICRONS_MIN } from '../grinders/grinderFieldLimits.js';

import {
  EXTRA_FINE_MICRONS_MAX,
  FINE_MICRONS_MAX,
  MEDIUM_COARSE_MICRONS_MAX,
  MEDIUM_FINE_MICRONS_MAX,
  MEDIUM_MICRONS_MAX,
} from './conversionFieldLimits.js';
import { GRIND_DESCRIPTORS, type GrindDescriptor } from './grindDescriptors.js';
import type { MicronWindow } from './micronWindowSchema.js';

const HALF = 2;

/**
 * The bands behind the six words, in microns.
 *
 * Contiguous and covering the whole usable range, because the table is read in
 * both directions: a number becomes a word so that a grinder with no curve
 * still gets an instruction, and a word becomes a number so that a recipe
 * whose author only wrote "medium-fine" can still be converted.
 */
export const GRIND_DESCRIPTOR_WINDOWS: Record<GrindDescriptor, MicronWindow> = {
  [GRIND_DESCRIPTORS.extraFine]: { min: GRIND_MICRONS_MIN, max: EXTRA_FINE_MICRONS_MAX },
  [GRIND_DESCRIPTORS.fine]: { min: EXTRA_FINE_MICRONS_MAX, max: FINE_MICRONS_MAX },
  [GRIND_DESCRIPTORS.mediumFine]: { min: FINE_MICRONS_MAX, max: MEDIUM_FINE_MICRONS_MAX },
  [GRIND_DESCRIPTORS.medium]: { min: MEDIUM_FINE_MICRONS_MAX, max: MEDIUM_MICRONS_MAX },
  [GRIND_DESCRIPTORS.mediumCoarse]: { min: MEDIUM_MICRONS_MAX, max: MEDIUM_COARSE_MICRONS_MAX },
  [GRIND_DESCRIPTORS.coarse]: { min: MEDIUM_COARSE_MICRONS_MAX, max: GRIND_MICRONS_MAX },
};

const DESCRIPTORS_FINE_TO_COARSE: readonly GrindDescriptor[] = [
  GRIND_DESCRIPTORS.extraFine,
  GRIND_DESCRIPTORS.fine,
  GRIND_DESCRIPTORS.mediumFine,
  GRIND_DESCRIPTORS.medium,
  GRIND_DESCRIPTORS.mediumCoarse,
  GRIND_DESCRIPTORS.coarse,
];

const COARSEST = GRIND_DESCRIPTORS.coarse;

/**
 * The word for a particle size.
 *
 * Walked from fine to coarse and taking the first band the number fits inside,
 * so a value sitting exactly on a boundary belongs to the finer of the two
 * bands rather than to whichever one the iteration happened to reach first.
 */
export const describeMicrons = (microns: number): GrindDescriptor =>
  DESCRIPTORS_FINE_TO_COARSE.find(
    (descriptor: GrindDescriptor): boolean => microns <= GRIND_DESCRIPTOR_WINDOWS[descriptor].max,
  ) ?? COARSEST;

/** The middle of a word's band, which is the number that word is worth. */
export const micronsForDescriptor = (descriptor: GrindDescriptor): number => {
  const window = GRIND_DESCRIPTOR_WINDOWS[descriptor];

  return (window.min + window.max) / HALF;
};
