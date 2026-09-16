import { readBrewerParams, type Equipment } from '@brewmate/shared';

/** The method a brewer was bought for, when it names one. */
export const readBrewerMethodId = (brewer: Equipment): string | null =>
  readBrewerParams(brewer.params).methodId ?? null;

/**
 * The piece of gear one method is brewed in, if the user owns it.
 *
 * Owning it is not a condition of being offered the method - every method is
 * offered - but it is what supplies the capacity and basket size a recipe is
 * sized against. Nothing found means those figures are simply unknown.
 */
export const findBrewerForMethod = (
  brewers: readonly Equipment[],
  methodId: string,
): Equipment | undefined =>
  brewers.find((brewer: Equipment): boolean => readBrewerMethodId(brewer) === methodId);
