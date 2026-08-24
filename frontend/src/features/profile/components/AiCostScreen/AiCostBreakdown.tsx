import type { AiUsageFunctionTotal } from '@brewmate/shared';
import type { JSX } from 'react';

import { Card, ListItem, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatCost } from '../../../../lib/formatters';
import { resolveAiFunctionLabelKey } from '../../constants';

const NOTHING = 0;

export interface AiCostBreakdownProps {
  readonly totals: readonly AiUsageFunctionTotal[];
}

/**
 * Where the month went, by feature.
 *
 * A total on its own is not actionable - somebody who has spent their
 * allowance wants to know on what, and the answer is usually one feature they
 * did not realise was expensive. Ranked by cost by the API, so the first row
 * is always the one worth reading.
 */
export const AiCostBreakdown = ({ totals }: AiCostBreakdownProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.aiCostsByFunctionTitle)}</Text>
      {totals.length === NOTHING ? (
        <Text variant="bodySmall" tone="muted">
          {t(TRANSLATION_KEYS.aiCostsByFunctionEmpty)}
        </Text>
      ) : null}
      {totals.map((total: AiUsageFunctionTotal, index: number): JSX.Element => {
        /** Assembled before the JSX, because a sentence is never built inside it. */
        const amount = t(TRANSLATION_KEYS.aiCostsAmount, {
          value: formatCost(total.costEstimate),
          currency: t(TRANSLATION_KEYS.unitCurrency),
        });

        return (
          <ListItem
            key={total.functionName}
            title={t(resolveAiFunctionLabelKey(total.functionName))}
            subtitle={t(TRANSLATION_KEYS.aiCostsFunctionCalls, { count: total.calls })}
            showDivider={index > NOTHING}
            trailing={
              <Text variant="labelMedium" tone="muted" numeric>
                {amount}
              </Text>
            }
          />
        );
      })}
    </Card>
  );
};
