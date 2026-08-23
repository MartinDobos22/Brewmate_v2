import type { BagEvaluation, TasteProfile } from '@brewmate/shared';
import { useState } from 'react';

import { useTranslation } from '../../../i18n';
import { useCreateCoffeeBag } from '../../inventory/hooks';
import {
  EMPTY_COFFEE_BAG_FORM,
  toCreateCoffeeBagRequest,
  toParsedBagData,
  type CoffeeBagFormValues,
} from '../../inventory/services';
import { useTasteProfile } from '../../tasteProfile/hooks';
import { BAG_SCAN_STAGES, BAG_VERDICT_BODY_KEYS, type BagScanStage } from '../constants/bagScan';
import type { BagUncertainty, BagVerdictPoint } from '../services/bagVerdictTypes';
import { evaluateBag, type BagVerdict } from '../services/evaluateBag';
import { useCreateBagEvaluation } from './useCreateBagEvaluation';
import { useUpdateBagEvaluation } from './useUpdateBagEvaluation';

const NOT_PURCHASED = false;
const PURCHASED = true;

export interface BagScan {
  readonly stage: BagScanStage;
  readonly label: CoffeeBagFormValues;
  readonly verdict: BagVerdict | null;
  readonly profile: TasteProfile | undefined;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly error: unknown;
  readonly retry: () => void;
  readonly isPending: boolean;
  readonly hasFailed: boolean;
  readonly wasPurchased: boolean;
  readonly describeLabel: (patch: Partial<CoffeeBagFormValues>) => void;
  readonly ask: () => void;
  readonly recordPurchase: (fallbackName: string) => void;
  readonly recordSkipped: () => void;
  readonly reset: () => void;
}

/**
 * One bag, weighed up in a shop.
 *
 * The verdict is computed on the phone and only then written down, so what the
 * app said is stored word for word next to the label it was said about - and
 * the API stamps how confident the profile was at that moment, which is what
 * makes the advice auditable a month later.
 *
 * Whether the bag was actually bought is recorded afterwards, because that is
 * the only way the app ever finds out whether it was any good at this.
 */
export const useBagScan = (): BagScan => {
  const { t } = useTranslation();
  const profileQuery = useTasteProfile();
  const createEvaluation = useCreateBagEvaluation();
  const updateEvaluation = useUpdateBagEvaluation();
  const createBag = useCreateCoffeeBag();
  const [stage, setStage] = useState<BagScanStage>(BAG_SCAN_STAGES.label);
  const [label, setLabel] = useState<CoffeeBagFormValues>(EMPTY_COFFEE_BAG_FORM);
  const [verdict, setVerdict] = useState<BagVerdict | null>(null);
  const [evaluationId, setEvaluationId] = useState<string | null>(null);
  const [wasPurchased, setWasPurchased] = useState(NOT_PURCHASED);

  const settle = (purchased: boolean): void => {
    setWasPurchased(purchased);
    setStage(BAG_SCAN_STAGES.done);
  };

  const recordOutcome = (purchased: boolean, linkedBagId: string | null): void => {
    if (evaluationId === null) {
      settle(purchased);

      return;
    }

    updateEvaluation.mutate(
      { id: evaluationId, changes: { wasPurchased: purchased, linkedBagId } },
      {
        onSuccess: (): void => {
          settle(purchased);
        },
      },
    );
  };

  return {
    stage,
    label,
    verdict,
    wasPurchased,
    profile: profileQuery.data,
    isLoading: profileQuery.isPending,
    isError: profileQuery.isError,
    error: profileQuery.error,
    isPending: createEvaluation.isPending || updateEvaluation.isPending || createBag.isPending,
    hasFailed: createEvaluation.isError || updateEvaluation.isError || createBag.isError,
    retry: (): void => {
      void profileQuery.refetch();
    },

    describeLabel: (patch: Partial<CoffeeBagFormValues>): void => {
      setLabel({ ...label, ...patch });
    },

    ask: (): void => {
      if (profileQuery.data === undefined) {
        return;
      }

      const parsedData = toParsedBagData(label);
      const answer = evaluateBag(parsedData, profileQuery.data);

      setVerdict(answer);
      setStage(BAG_SCAN_STAGES.verdict);
      createEvaluation.mutate(
        {
          parsedData,
          verdictText: t(BAG_VERDICT_BODY_KEYS[answer.level]),
          reasoning: {
            points: answer.points.map((point: BagVerdictPoint): string => t(point.key)),
          },
          uncertainties: {
            items: answer.uncertainties.map((item: BagUncertainty) => ({
              field: item.field,
              reason: t(item.reasonKey),
            })),
          },
        },
        {
          onSuccess: (evaluation: BagEvaluation): void => {
            setEvaluationId(evaluation.id);
          },
        },
      );
    },

    recordPurchase: (fallbackName: string): void => {
      createBag.mutate(toCreateCoffeeBagRequest(label, fallbackName), {
        onSuccess: ({ id }): void => {
          recordOutcome(PURCHASED, id);
        },
      });
    },

    recordSkipped: (): void => {
      recordOutcome(NOT_PURCHASED, null);
    },

    reset: (): void => {
      setLabel(EMPTY_COFFEE_BAG_FORM);
      setVerdict(null);
      setEvaluationId(null);
      setStage(BAG_SCAN_STAGES.label);
    },
  };
};
