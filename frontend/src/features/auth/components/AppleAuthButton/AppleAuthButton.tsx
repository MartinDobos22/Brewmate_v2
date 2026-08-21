import * as AppleAuthentication from 'expo-apple-authentication';
import type { JSX } from 'react';

import { COLOR_SCHEMES, useTheme, useThemedStyles } from '../../../../theme';
import { useAppleSignIn } from '../../hooks';
import { AuthErrorMessage } from '../AuthErrorMessage';

import { createAppleAuthButtonStyles } from './AppleAuthButton.styles';

/**
 * Sign in with Apple, drawn by Apple's own component because their review
 * guidelines require that exact button.
 *
 * Renders nothing where the feature does not exist (Android, older iOS), which
 * is why the hook reports availability rather than the screen guessing.
 */
export const AppleAuthButton = (): JSX.Element | null => {
  const styles = useThemedStyles(createAppleAuthButtonStyles);
  const theme = useTheme();
  const { signIn, errorKey, ready } = useAppleSignIn();

  if (!ready) {
    return null;
  }

  return (
    <>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
        buttonStyle={
          theme.scheme === COLOR_SCHEMES.dark
            ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
            : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
        }
        cornerRadius={theme.shape.button}
        style={styles.button}
        onPress={signIn}
      />
      <AuthErrorMessage errorKey={errorKey} />
    </>
  );
};
