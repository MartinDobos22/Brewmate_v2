import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { ConfidenceNotice } from '../../../tasteProfile/components';
import { BAG_VERDICT_BODY_KEYS, BAG_VERDICT_TITLE_KEYS } from '../../constants/bagScan';
import type { BagUncertainty, BagVerdictPoint } from '../../services/bagVerdictTypes';
import type { BagVerdict } from '../../services/evaluateBag';

import { createBagVerdictCardStyles } from './BagVerdictCard.styles';

const NOTHING = 0;

export interface BagVerdictCardProps {
  readonly verdict: BagVerdict;
}

/**
 * The answer, and everything it rests on.
 *
 * The reasoning and the gaps are printed separately and both in full: an
 * opinion somebody can argue with is worth something in a shop, and a verdict
 * that hides what it did not see is worth nothing.
 */
export const BagVerdictCard = ({ verdict }: BagVerdictCardProps): JSX.Element => {
  const styles = useThemedStyles(createBagVerdictCardStyles);
  const { t } = useTranslation();

  return (
    <Card>
      <Text variant="labelMedium" tone="muted">
        {t(TRANSLATION_KEYS.scanVerdictTitle)}
      </Text>
      <Text variant="headlineSmall">{t(BAG_VERDICT_TITLE_KEYS[verdict.level])}</Text>
      <Text variant="bodyMedium" tone="muted">
        {t(BAG_VERDICT_BODY_KEYS[verdict.level])}
      </Text>
      <ConfidenceNotice />
      {verdict.points.length === NOTHING ? null : (
        <View style={styles.section}>
          <Text variant="titleSmall">{t(TRANSLATION_KEYS.scanReasoningTitle)}</Text>
          <View style={styles.points}>
            {verdict.points.map((point: BagVerdictPoint): JSX.Element => (
              <Text
                key={point.key}
                variant="bodySmall"
                tone={point.isAgainst ? 'error' : 'default'}
              >
                {t(point.key)}
              </Text>
            ))}
          </View>
        </View>
      )}
      {verdict.uncertainties.length === NOTHING ? null : (
        <View style={styles.section}>
          <Text variant="titleSmall">{t(TRANSLATION_KEYS.scanUncertaintyTitle)}</Text>
          <View style={styles.points}>
            {verdict.uncertainties.map((item: BagUncertainty): JSX.Element => (
              <Text key={item.field} variant="bodySmall" tone="muted">
                {t(item.reasonKey)}
              </Text>
            ))}
          </View>
        </View>
      )}
    </Card>
  );
};
