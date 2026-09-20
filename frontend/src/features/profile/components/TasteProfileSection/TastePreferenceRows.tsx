import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { TasteProfile } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { milkUsageLabelKey, roastPreferenceLabelKey } from '../../../tasteProfile/services';
import { PREFERENCE_ICONS } from '../../constants';

import { createTasteProfileSectionStyles } from './TasteProfileSection.styles';

export interface TastePreferenceRowsProps {
  readonly profile: TasteProfile;
}

/**
 * The two answers that are a choice rather than a position on a scale.
 *
 * Drawn in the same row geometry as the five axes, because they read as the
 * same kind of statement - but kept in their own card, because they are not
 * the same kind of evidence: these two were said outright, where an axis is a
 * weighted mean of a dozen answers about chocolate and tea.
 */
export const TastePreferenceRows = ({ profile }: TastePreferenceRowsProps): JSX.Element => {
  const styles = useThemedStyles(createTasteProfileSectionStyles);
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <MaterialCommunityIcons
          name={PREFERENCE_ICONS.roast}
          size={theme.size.axisRowGlyph}
          color={theme.colors.onSurfaceVariant}
        />
        <View style={styles.name}>
          <Text variant="eyebrow" tone="muted">
            {t(TRANSLATION_KEYS.profileRoastPreference)}
          </Text>
        </View>
        <Text variant="bodyText" align="right">
          {t(roastPreferenceLabelKey(profile.roastPreference))}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <MaterialCommunityIcons
          name={PREFERENCE_ICONS.milk}
          size={theme.size.axisRowGlyph}
          color={theme.colors.onSurfaceVariant}
        />
        <View style={styles.name}>
          <Text variant="eyebrow" tone="muted">
            {t(TRANSLATION_KEYS.profileMilkUsage)}
          </Text>
        </View>
        <Text variant="bodyText" align="right">
          {t(milkUsageLabelKey(profile.milkUsage))}
        </Text>
      </View>
    </View>
  );
};
