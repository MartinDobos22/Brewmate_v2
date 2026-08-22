import { readBrewerParams, type BrewMethod, type Equipment } from '@brewmate/shared';

/** The method a brewer was bought for, when it names one. */
export const readBrewerMethodId = (brewer: Equipment): string | null =>
  readBrewerParams(brewer.params).methodId ?? null;

/** The piece of gear that makes one method brewable, if the user owns it. */
export const findBrewerForMethod = (
  brewers: readonly Equipment[],
  methodId: string,
): Equipment | undefined =>
  brewers.find((brewer: Equipment): boolean => readBrewerMethodId(brewer) === methodId);

/**
 * The methods the user can actually brew.
 *
 * A method that needs no equipment at all - cupping is a cup and a spoon - is
 * always available. Everything else has to be pointed at by something in the
 * cupboard, which is what keeps Brewmate from suggesting a Chemex to somebody
 * who does not own one.
 */
export const filterBrewableMethods = (
  methods: readonly BrewMethod[],
  brewers: readonly Equipment[],
): readonly BrewMethod[] =>
  methods.filter(
    (method: BrewMethod): boolean =>
      method.requiresEquipmentType === null ||
      findBrewerForMethod(brewers, method.id) !== undefined,
  );
