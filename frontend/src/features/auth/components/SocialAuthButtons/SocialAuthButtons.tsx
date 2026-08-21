import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { isGoogleAuthConfigured, readGoogleAuthConfig } from '../../../../config';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { AppleAuthButton } from '../AppleAuthButton';
import { GoogleAuthButton } from '../GoogleAuthButton';

import { createSocialAuthButtonsStyles } from './SocialAuthButtons.styles';

export interface SocialAuthButtonsProps {
  readonly disabled?: boolean;
}

/**
 * The two ways in that are not an e-mail and a password. Apple sits next to
 * Google on purpose: an app that offers one third-party login has to offer
 * Apple's as well, or it does not pass review.
 */
export const SocialAuthButtons = ({ disabled = false }: SocialAuthButtonsProps): JSX.Element => {
  const styles = useThemedStyles(createSocialAuthButtonsStyles);
  const { t } = useTranslation();
  const googleAvailable = isGoogleAuthConfigured(readGoogleAuthConfig());

  return (
    <View style={styles.wrapper}>
      <View style={styles.divider}>
        <View style={styles.rule} />
        <Text variant="labelMedium" tone="muted">
          {t(TRANSLATION_KEYS.authDividerOr)}
        </Text>
        <View style={styles.rule} />
      </View>
      {googleAvailable ? <GoogleAuthButton disabled={disabled} /> : null}
      <AppleAuthButton />
    </View>
  );
};
