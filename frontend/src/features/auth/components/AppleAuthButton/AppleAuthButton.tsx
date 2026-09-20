import * as AppleAuthentication from 'expo-apple-authentication';
import type { JSX } from 'react';

import { useTheme, useThemedStyles } from '../../../../theme';
import { useAppleSignIn } from '../../hooks';
import { AuthErrorMessage } from '../AuthErrorMessage';

import { appleCornerRadius, createAppleAuthButtonStyles } from './AppleAuthButton.styles';

/**
 * Sign in with Apple, drawn by Apple's own component because their review
 * guidelines require that exact button.
 *
 * Renders nothing where the feature does not exist (Android, older iOS), which
 * is why the hook reports availability rather than the screen guessing.
 *
 * Always the white variant, and not because of the colour scheme. The screen
 * it stands on is brown in both schemes, so the black button that used to be
 * drawn in light mode was a dark button on a dark ground - Apple's own
 * guidance is to pick the one that contrasts with what is behind it, which
 * here is one answer rather than two.
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
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
        cornerRadius={appleCornerRadius(theme)}
        style={styles.button}
        onPress={signIn}
      />
      <AuthErrorMessage errorKey={errorKey} />
    </>
  );
};
