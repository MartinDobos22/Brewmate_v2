import type { JSX } from 'react';
import { View } from 'react-native';

import { Chip } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useSetThemePreference, useThemePreference } from '../../../../stores/uiStore';
import { useThemedStyles } from '../../../../theme';
import { APPEARANCE_OPTIONS, type AppearanceOption } from '../../constants';

import { createAppearancePickerStyles } from './AppearancePicker.styles';

/** Lets the user pin the app to a scheme instead of following the system. */
export const AppearancePicker = (): JSX.Element => {
  const styles = useThemedStyles(createAppearancePickerStyles);
  const { t } = useTranslation();
  const preference = useThemePreference();
  const setPreference = useSetThemePreference();

  return (
    <View style={styles.row} accessibilityLabel={t(TRANSLATION_KEYS.profileAppearanceTitle)}>
      {APPEARANCE_OPTIONS.map((option: AppearanceOption): JSX.Element => (
        <Chip
          key={option.preference}
          label={t(option.labelKey)}
          selected={preference === option.preference}
          onPress={(): void => {
            setPreference(option.preference);
          }}
        />
      ))}
    </View>
  );
};
