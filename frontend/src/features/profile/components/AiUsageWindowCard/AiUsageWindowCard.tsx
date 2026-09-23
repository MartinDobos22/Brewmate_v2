import { AI_LIMIT_KINDS, type AiUsageWindow } from '@brewmate/shared';
import type { JSX } from 'react';

import { Card, InfoNote, SectionHeading } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation, type TranslationKey } from '../../../../i18n';
import { formatCost, formatDateTime, readCostAmount } from '../../../../lib/formatters';
import { UsageMeter } from '../UsageMeter';

export interface AiUsageWindowCardProps {
  readonly window: AiUsageWindow;
  readonly titleKey: TranslationKey;
}

/**
 * One window, its two ceilings and when it comes back.
 *
 * Both are drawn the same way, which is the whole point of the card. They
 * guard different failures - the call count catches a screen retrying in a
 * loop before it has cost anything, the money is the actual budget - and they
 * run out independently, so a card that gave one a bar and the other a
 * sentence was telling somebody refused with room on the bar they can see
 * that nothing was wrong.
 *
 * `resetsAt` is printed as a moment rather than as "skús neskôr". A limit
 * without a time attached is a limit nobody can plan around.
 */
export const AiUsageWindowCard = ({ window, titleKey }: AiUsageWindowCardProps): JSX.Element => {
  const { t } = useTranslation();

  /** Assembled before the JSX, because a sentence is never built inside it. */
  const amount = (value: string): string =>
    t(TRANSLATION_KEYS.aiCostsAmount, {
      value: formatCost(value),
      currency: t(TRANSLATION_KEYS.unitCurrency),
    });

  return (
    <Card>
      <SectionHeading
        title={t(titleKey)}
        caption={t(TRANSLATION_KEYS.aiCostsResetsAt, { time: formatDateTime(window.resetsAt) })}
        placement="card"
      />
      <UsageMeter
        label={t(TRANSLATION_KEYS.aiCostsCallsLabel)}
        figure={t(TRANSLATION_KEYS.aiCostsRatio, {
          used: window.calls,
          limit: window.callLimit,
        })}
        used={window.calls}
        ceiling={window.callLimit}
      />
      <UsageMeter
        label={t(TRANSLATION_KEYS.aiCostsSpentLabel)}
        figure={t(TRANSLATION_KEYS.aiCostsAmountRatio, {
          used: amount(window.costEstimate),
          limit: amount(window.costLimit),
        })}
        used={readCostAmount(window.costEstimate)}
        ceiling={readCostAmount(window.costLimit)}
      />
      {window.exhaustedBy === null ? null : (
        <InfoNote
          tone="caution"
          text={t(
            window.exhaustedBy === AI_LIMIT_KINDS.calls
              ? TRANSLATION_KEYS.aiCostsExhaustedCalls
              : TRANSLATION_KEYS.aiCostsExhaustedCost,
          )}
        />
      )}
    </Card>
  );
};
