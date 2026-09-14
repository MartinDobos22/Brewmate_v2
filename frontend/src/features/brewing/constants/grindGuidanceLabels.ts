import {
  GRIND_DESCRIPTORS,
  GRIND_SHIFT_SOURCES,
  type GrindDescriptor,
  type GrindShiftSource,
} from '@brewmate/shared';

import type { TileGlyph } from '../../../components/ui';
import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

/**
 * The glyph on each grinder in the picker.
 *
 * One picture for all of them rather than one per kind of machine: a hand
 * grinder and an electric one are told apart by their names, which is what
 * their owner calls them, and a second glyph would be the card guessing at a
 * distinction the catalogue does not record.
 */
export const GRINDER_OPTION_ICON: TileGlyph = 'coffee-outline';

/** The six grind words, in Slovak, as the guidance card prints them. */
export const GRIND_DESCRIPTOR_LABEL_KEYS: Record<GrindDescriptor, TranslationKey> = {
  [GRIND_DESCRIPTORS.extraFine]: TRANSLATION_KEYS.grindDescriptorExtraFine,
  [GRIND_DESCRIPTORS.fine]: TRANSLATION_KEYS.grindDescriptorFine,
  [GRIND_DESCRIPTORS.mediumFine]: TRANSLATION_KEYS.grindDescriptorMediumFine,
  [GRIND_DESCRIPTORS.medium]: TRANSLATION_KEYS.grindDescriptorMedium,
  [GRIND_DESCRIPTORS.mediumCoarse]: TRANSLATION_KEYS.grindDescriptorMediumCoarse,
  [GRIND_DESCRIPTORS.coarse]: TRANSLATION_KEYS.grindDescriptorCoarse,
};

/**
 * What each fact off the bag is called when the card says why the starting
 * point is where it is.
 *
 * Total over the sources, so a fact added to the guidance is a type error here
 * rather than a reason that quietly stops being printed - and the reasons are
 * the whole difference between advice somebody can argue with and a number
 * that appeared.
 */
export const GRIND_SHIFT_LABEL_KEYS: Record<GrindShiftSource, TranslationKey> = {
  [GRIND_SHIFT_SOURCES.roastLevel]: TRANSLATION_KEYS.preBrewGrindShiftRoast,
  [GRIND_SHIFT_SOURCES.process]: TRANSLATION_KEYS.preBrewGrindShiftProcess,
  [GRIND_SHIFT_SOURCES.restDays]: TRANSLATION_KEYS.preBrewGrindShiftRest,
};
