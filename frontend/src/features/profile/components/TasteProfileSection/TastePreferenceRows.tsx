import type { TasteProfile } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { milkUsageLabelKey, roastPreferenceLabelKey } from '../../../tasteProfile/services';

import { createTasteProfileSectionStyles } from './TasteProfileSection.styles';

export interface TastePreferenceRowsProps {
  readonly profile: TasteProfile;
}

/** The two answers that are a choice rather than a position on a scale. */
export const TastePreferenceRows = ({ profile }: TastePreferenceRowsProps): JSX.Element => {
  const styles = useThemedStyles(createTasteProfileSectionStyles);
  const { t } = useTranslation();

  return (
    <>
      <View style={styles.row}>
        <Text variant="labelMedium" tone="muted">
          {t(TRANSLATION_KEYS.profileRoastPreference)}
        </Text>
        <Text variant="bodyMedium">{t(roastPreferenceLabelKey(profile.roastPreference))}</Text>
      </View>
      <View style={styles.row}>
        <Text variant="labelMedium" tone="muted">
          {t(TRANSLATION_KEYS.profileMilkUsage)}
        </Text>
        <Text variant="bodyMedium">{t(milkUsageLabelKey(profile.milkUsage))}</Text>
      </View>
    </>
  );
};
