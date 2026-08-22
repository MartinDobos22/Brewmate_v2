import type { TasteProfile } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { CONFIDENCE_LABEL_KEYS } from '../../constants';
import { resolveConfidenceLevel } from '../../services';

import { createConfidenceIndicatorStyles } from './ConfidenceIndicator.styles';

export interface ConfidenceIndicatorProps {
  readonly profile: TasteProfile;
}

/**
 * How much of the profile above is actually earned.
 *
 * The brew count sits next to the word because it is the honest half: a
 * confidence of "celkom slušne" built from a questionnaire and no brews means
 * something different from the same word after twenty cups, and the reader can
 * see which one they are looking at.
 */
export const ConfidenceIndicator = ({ profile }: ConfidenceIndicatorProps): JSX.Element => {
  const styles = useThemedStyles(createConfidenceIndicatorStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Text variant="labelMedium" tone="muted">
          {t(TRANSLATION_KEYS.profileConfidenceTitle)}
        </Text>
        <Text variant="titleMedium">
          {t(CONFIDENCE_LABEL_KEYS[resolveConfidenceLevel(profile.confidenceLevel)])}
        </Text>
      </View>
      <View style={styles.row}>
        <Text variant="bodySmall" tone="muted">
          {t(TRANSLATION_KEYS.profileConfidenceBrewsLabel)}
        </Text>
        <Text variant="numericSmall" numeric>
          {String(profile.brewCount)}
        </Text>
      </View>
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.profileConfidenceHint)}
      </Text>
    </View>
  );
};
