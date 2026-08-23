import type { BagEvaluation, EvaluateCoffeeResponse, ParsedBagData } from '@brewmate/shared';
import { useState } from 'react';

import { TRANSLATION_KEYS, useTranslation } from '../../../i18n';
import { useTasteProfile } from '../../tasteProfile/hooks';
import { BAG_VERDICT_BODY_KEYS, BAG_VERDICT_TITLE_KEYS } from '../constants/bagScan';
import type { BagUncertainty, BagVerdictPoint } from '../services/bagVerdictTypes';
import { evaluateBag } from '../services/evaluateBag';
import { toBagVerdictView, type BagVerdictView } from '../services/bagVerdictView';

import { useCreateBagEvaluation } from './useCreateBagEvaluation';
import { useEvaluateCoffee } from './useEvaluateCoffee';

const IS_LOCAL = true;
const NOT_FROM_HISTORY = false;

export interface BagVerdict {
  readonly view: BagVerdictView | null;
  readonly evaluationId: string | null;
  readonly isPending: boolean;
  readonly hasFailed: boolean;
  readonly ask: (coffee: ParsedBagData, imageUrl: string | null) => Promise<void>;
  readonly forget: () => void;
}

/**
 * The answer to "mám si ju kúpiť?", however it can be got.
 *
 * The API writes it: a Slovak paragraph, argued against this person's profile,
 * with what it could not see listed separately. When that call cannot be made -
 * no signal in the shop, no provider configured, a model that will not answer -
 * the three offline rules write one instead, and the card says so.
 *
 * The fallback is not a nicety. This screen exists to be used in front of a
 * shelf, which is exactly where a phone has one bar, and an app that answers
 * "skús to znova" there has answered nothing. Every path through this hook
 * ends with a view: a screen that waited forever would be the one failure the
 * fallback was built to prevent.
 */
export const useBagVerdict = (): BagVerdict => {
  const { t } = useTranslation();
  const profileQuery = useTasteProfile();
  const evaluate = useEvaluateCoffee();
  const createEvaluation = useCreateBagEvaluation();
  const [view, setView] = useState<BagVerdictView | null>(null);
  const [evaluationId, setEvaluationId] = useState<string | null>(null);

  const showNothingKnown = (): void => {
    setView({
      headline: t(TRANSLATION_KEYS.scanVerdictUnknown),
      text: t(TRANSLATION_KEYS.scanVerdictUnknownBody),
      reasons: [],
      uncertainties: [],
      isFromHistory: NOT_FROM_HISTORY,
      writtenAt: null,
      isLocal: IS_LOCAL,
    });
  };

  const askLocally = async (coffee: ParsedBagData): Promise<void> => {
    const profile = profileQuery.data;

    if (profile === undefined) {
      showNothingKnown();

      return;
    }

    const answer = evaluateBag(coffee, profile);
    const reasons = answer.points.map((point: BagVerdictPoint): string => t(point.key));
    const uncertainties = answer.uncertainties.map((item: BagUncertainty) => ({
      field: item.field,
      reason: t(item.reasonKey),
    }));

    setView({
      headline: t(BAG_VERDICT_TITLE_KEYS[answer.level]),
      text: t(BAG_VERDICT_BODY_KEYS[answer.level]),
      reasons,
      uncertainties,
      isFromHistory: NOT_FROM_HISTORY,
      writtenAt: null,
      isLocal: IS_LOCAL,
    });

    /*
     * Stored even though a model never saw it, because what the app said in a
     * shop is worth keeping whoever said it - and because the outcome recorded
     * against it afterwards is the only way anybody finds out whether the
     * advice was any good. A failure here costs the audit trail, not the
     * answer, so it is swallowed rather than shown.
     */
    const stored: BagEvaluation = await createEvaluation.mutateAsync({
      parsedData: coffee,
      verdictText: t(BAG_VERDICT_BODY_KEYS[answer.level]),
      reasoning: { points: reasons },
      uncertainties: { items: uncertainties },
    });

    setEvaluationId(stored.id);
  };

  return {
    view,
    evaluationId,
    isPending: evaluate.isPending || createEvaluation.isPending,
    hasFailed: createEvaluation.isError,

    ask: async (coffee: ParsedBagData, imageUrl: string | null): Promise<void> => {
      try {
        const answer: EvaluateCoffeeResponse = await evaluate.mutateAsync({
          parsedData: coffee,
          imageUrl,
        });

        setView(
          toBagVerdictView(
            answer.evaluation,
            answer.fromHistory,
            t(TRANSLATION_KEYS.scanVerdictUnknownBody),
          ),
        );
        setEvaluationId(answer.evaluation.id);
      } catch {
        await askLocally(coffee).catch((): void => {
          setEvaluationId(null);
        });
      }
    },

    forget: (): void => {
      setView(null);
      setEvaluationId(null);
    },
  };
};
