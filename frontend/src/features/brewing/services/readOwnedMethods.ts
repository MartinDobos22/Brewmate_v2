import type { BrewMethod, Equipment } from '@brewmate/shared';

import { readBrewerMethodId } from '../../inventory/services';

/**
 * The methods the cupboard actually vouches for, in the catalogue's own order.
 *
 * These are the ones drawn as cards, because choosing between two objects
 * somebody owns is a different act from finding one in a catalogue of
 * eighteen. The rest are still offered - hiding them reads as helpful and
 * behaves as a trap, since a cupboard nobody has filled in is
 * indistinguishable from an empty one - they are just behind a field rather
 * than stacked as pictures.
 */
export const readOwnedMethods = (
  methods: readonly BrewMethod[],
  brewers: readonly Equipment[],
): readonly BrewMethod[] => {
  const owned = new Set(
    brewers
      .map(readBrewerMethodId)
      .filter((methodId: string | null): methodId is string => methodId !== null),
  );

  return methods.filter((method: BrewMethod): boolean => owned.has(method.id));
};
