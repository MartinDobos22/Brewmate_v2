import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { ONBOARDING_HEADER_ICONS } from '../../constants';

import { createOnboardingHeaderStyles } from './OnboardingHeader.styles';

export interface OnboardingHeaderProps {
  readonly canGoBack: boolean;
  readonly onBack: () => void;
  readonly leaveLabel: string;
  readonly onLeave: () => void;
}

/** The way back and the way out, at the top of every step of the flow. */
export const OnboardingHeader = ({
  canGoBack,
  onBack,
  leaveLabel,
  onLeave,
}: OnboardingHeaderProps): JSX.Element => {
  const styles = useThemedStyles(createOnboardingHeaderStyles);
  const theme = useTheme();
  const { t } = useTranslation();

  const backStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.back,
    pressed && styles.pressed,
  ];
  const skipStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.skip,
    pressed && styles.pressed,
  ];

  return (
    <View style={styles.row}>
      {canGoBack ? (
        <Pressable
          style={backStyle}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel={t(TRANSLATION_KEYS.actionBack)}
        >
          <MaterialCommunityIcons
            name={ONBOARDING_HEADER_ICONS.back}
            size={theme.size.iconMedium}
            color={theme.colors.espresso}
          />
        </Pressable>
      ) : (
        <View />
      )}
      <Pressable
        style={skipStyle}
        onPress={onLeave}
        accessibilityRole="button"
        accessibilityLabel={leaveLabel}
      >
        <Text variant="statusLabel">{leaveLabel}</Text>
        <MaterialCommunityIcons
          name={ONBOARDING_HEADER_ICONS.leave}
          size={theme.size.iconSmall}
          color={theme.colors.onSurfaceVariant}
        />
      </Pressable>
    </View>
  );
};
