import { AI_LIMIT_KINDS, type AiUsageWindow } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, ProgressBar, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation, type TranslationKey } from '../../../../i18n';
import { formatCost, formatDateTime } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';

import { createAiUsageWindowStyles } from './AiUsageWindowCard.styles';

export interface AiUsageWindowCardProps {
  readonly window: AiUsageWindow;
  readonly titleKey: TranslationKey;
}

/**
 * One window, its two ceilings and when it comes back.
 *
 * Both ceilings are shown rather than only the nearer one, because they guard
 * different failures: the call count catches a screen retrying in a loop
 * before it has cost anything, and the money is the actual budget. Showing one
 * would leave somebody wondering why they were refused with room on the bar
 * they can see.
 *
 * `resetsAt` is printed as a moment rather than as "skús neskôr". A limit
 * without a time attached is a limit nobody can plan around.
 */
export const AiUsageWindowCard = ({ window, titleKey }: AiUsageWindowCardProps): JSX.Element => {
  const styles = useThemedStyles(createAiUsageWindowStyles);
  const { t } = useTranslation();

  return (
    <Card>
      <View style={styles.row}>
        <Text variant="titleMedium">{t(titleKey)}</Text>
        <Text variant="labelSmall" tone="muted">
          {t(TRANSLATION_KEYS.aiCostsResetsAt, { time: formatDateTime(window.resetsAt) })}
        </Text>
      </View>

      <View style={styles.bar}>
        <ProgressBar
          current={window.calls}
          total={window.callLimit}
          label={t(TRANSLATION_KEYS.aiCostsCalls, {
            used: window.calls,
            limit: window.callLimit,
          })}
        />
      </View>

      <View style={styles.body}>
        <Text variant="bodySmall">
          {t(TRANSLATION_KEYS.aiCostsCalls, { used: window.calls, limit: window.callLimit })}
        </Text>
        <Text variant="bodySmall" tone="muted">
          {t(TRANSLATION_KEYS.aiCostsSpent, {
            spent: t(TRANSLATION_KEYS.aiCostsAmount, {
              value: formatCost(window.costEstimate),
              currency: t(TRANSLATION_KEYS.unitCurrency),
            }),
            limit: t(TRANSLATION_KEYS.aiCostsAmount, {
              value: formatCost(window.costLimit),
              currency: t(TRANSLATION_KEYS.unitCurrency),
            }),
          })}
        </Text>
        {window.exhaustedBy === null ? null : (
          <Text variant="labelMedium" tone="tertiary">
            {t(
              window.exhaustedBy === AI_LIMIT_KINDS.calls
                ? TRANSLATION_KEYS.aiCostsExhaustedCalls
                : TRANSLATION_KEYS.aiCostsExhaustedCost,
            )}
          </Text>
        )}
      </View>
    </Card>
  );
};
