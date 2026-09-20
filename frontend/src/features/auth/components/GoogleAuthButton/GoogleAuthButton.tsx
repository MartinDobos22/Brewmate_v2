import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { JSX } from 'react';
import { ActivityIndicator, Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { AUTH_ICONS } from '../../constants';
import { useGoogleSignIn } from '../../hooks';
import { AuthErrorMessage } from '../AuthErrorMessage';
import { createAuthSubmitButtonStyles } from '../AuthSubmitButton';

export interface GoogleAuthButtonProps {
  readonly disabled?: boolean;
}

/**
 * Only rendered when the OAuth client IDs are configured - the hook that backs
 * it refuses to build a request without them.
 */
export const GoogleAuthButton = ({ disabled = false }: GoogleAuthButtonProps): JSX.Element => {
  const styles = useThemedStyles(createAuthSubmitButtonStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const { signIn, isPending, errorKey, ready } = useGoogleSignIn();
  const label = t(TRANSLATION_KEYS.authGoogleAction);
  const isBlocked = disabled || !ready || isPending;

  const resolveStyle = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
    styles.provider,
    pressed && !isBlocked && styles.pressed,
    isBlocked && styles.disabled,
  ];

  return (
    <>
      <Pressable
        style={resolveStyle}
        onPress={signIn}
        disabled={isBlocked}
        accessibilityRole="button"
        accessibilityState={{ disabled: isBlocked, busy: isPending }}
        accessibilityLabel={label}
      >
        {isPending ? (
          <ActivityIndicator color={theme.colors.accentSoft} />
        ) : (
          <MaterialCommunityIcons
            name={AUTH_ICONS.google}
            size={theme.size.iconRow}
            color={theme.colors.accentSoft}
          />
        )}
        <Text variant="rowTitle" tone="onEspresso" numberOfLines={1}>
          {label}
        </Text>
      </Pressable>
      <AuthErrorMessage errorKey={errorKey} />
    </>
  );
};
