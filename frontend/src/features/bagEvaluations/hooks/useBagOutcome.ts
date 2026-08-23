import { useState } from 'react';

import { useCreateCoffeeBag } from '../../inventory/hooks';
import { toCreateCoffeeBagRequest, type CoffeeBagFormValues } from '../../inventory/services';

import { useUpdateBagEvaluation } from './useUpdateBagEvaluation';

const PURCHASED = true;
const NOT_PURCHASED = false;

export interface BagOutcome {
  readonly wasPurchased: boolean;
  readonly isPending: boolean;
  readonly hasFailed: boolean;
  /** Buying it also writes it into the cupboard, label and all. */
  readonly recordPurchase: (label: CoffeeBagFormValues, fallbackName: string) => void;
  readonly recordSkipped: () => void;
  readonly forget: () => void;
}

/**
 * Did the advice survive contact with the shelf?
 *
 * The only way the app ever finds out whether it was any good at this, which
 * is why it is asked at all rather than assumed from whether a bag turned up
 * in the cupboard later.
 *
 * Buying it also writes the coffee into the cupboard: somebody who has just
 * decided to buy a bag should not then be asked to type its label a second
 * time, and everything needed is already on the screen.
 */
export const useBagOutcome = (evaluationId: string | null, onSettled: () => void): BagOutcome => {
  const updateEvaluation = useUpdateBagEvaluation();
  const createBag = useCreateCoffeeBag();
  const [wasPurchased, setPurchased] = useState(NOT_PURCHASED);

  const record = (purchased: boolean, linkedBagId: string | null): void => {
    setPurchased(purchased);

    if (evaluationId === null) {
      onSettled();

      return;
    }

    updateEvaluation.mutate(
      { id: evaluationId, changes: { wasPurchased: purchased, linkedBagId } },
      { onSuccess: onSettled },
    );
  };

  return {
    wasPurchased,
    isPending: updateEvaluation.isPending || createBag.isPending,
    hasFailed: updateEvaluation.isError || createBag.isError,

    recordPurchase: (label: CoffeeBagFormValues, fallbackName: string): void => {
      createBag.mutate(toCreateCoffeeBagRequest(label, fallbackName), {
        onSuccess: ({ id }): void => {
          record(PURCHASED, id);
        },
      });
    },

    recordSkipped: (): void => {
      record(NOT_PURCHASED, null);
    },

    forget: (): void => {
      setPurchased(NOT_PURCHASED);
    },
  };
};
