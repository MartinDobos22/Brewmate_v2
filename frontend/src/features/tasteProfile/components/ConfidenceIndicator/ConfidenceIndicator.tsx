import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { TasteProfile } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Dial, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { CONFIDENCE_ICON, CONFIDENCE_LABEL_KEYS } from '../../constants';
import { resolveConfidenceLevel } from '../../services';

import { createConfidenceIndicatorStyles } from './ConfidenceIndicator.styles';

export interface ConfidenceIndicatorProps {
  readonly profile: TasteProfile;
}

/** How far the app has got at knowing somebody, drawn as well as said. */
export const ConfidenceIndicator = ({ profile }: ConfidenceIndicatorProps): JSX.Element => {
  const styles = useThemedStyles(createConfidenceIndicatorStyles);
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <Dial
        progress={profile.confidenceLevel}
        size={theme.size.dialSmall}
        strokeWidth={theme.size.dialSmallStroke}
        color={theme.colors.onEspressoPositive}
        trackColor={theme.colors.espressoLine}
        accessibilityLabel={t(TRANSLATION_KEYS.profileConfidenceTitle)}
      >
        <Text variant="numericValue" tone="onEspresso" numeric>
          {String(profile.brewCount)}
        </Text>
      </Dial>
      <View style={styles.body}>
        <View style={styles.title}>
          <MaterialCommunityIcons
            name={CONFIDENCE_ICON}
            size={theme.size.iconSmall}
            color={theme.colors.onEspressoPositive}
          />
          <Text variant="cardTitle" tone="onEspresso">
            {t(CONFIDENCE_LABEL_KEYS[resolveConfidenceLevel(profile.confidenceLevel)])}
          </Text>
        </View>
        <Text variant="caption" tone="onEspressoMuted">
          {t(TRANSLATION_KEYS.profileConfidenceHint)}
        </Text>
      </View>
    </View>
  );
};
