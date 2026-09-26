import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback, useState, type JSX } from 'react';
import { View } from 'react-native';

import { PillButton, Text } from '../../../../components/ui';
import { ROUTES } from '../../../../constants';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import {
  AUTH_ICONS,
  NOTICE_KEYS,
  VERIFY_STATE_ICON_COLORS,
  VERIFY_STATE_ICONS,
  VERIFY_STATE_TONES,
} from '../../constants';
import { useAuthSession } from '../../context';
import { useAuthAction } from '../../hooks';
import { refreshEmailVerification, resendVerificationEmail } from '../../services';
import { AuthErrorMessage } from '../AuthErrorMessage';
import { AuthScreenLayout } from '../AuthScreenLayout';
import { AuthNavigationLink } from '../AuthNavigationLink';

import { createVerifyEmailScreenStyles } from './VerifyEmailScreen.styles';

/**
 * Shown once, right after registering with an e-mail address. It nudges rather
 * than blocks: the account works either way, and the user can walk straight
 * into the app.
 */
export const VerifyEmailScreen = (): JSX.Element => {
  const styles = useThemedStyles(createVerifyEmailScreenStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const { user } = useAuthSession();
  const [isVerified, setIsVerified] = useState(user?.emailVerified ?? false);
  const state = isVerified ? 'verified' : 'pending';
  const resend = useAuthAction(resendVerificationEmail);
  const check = useAuthAction(
    useCallback(async (): Promise<void> => {
      setIsVerified(await refreshEmailVerification());
    }, []),
  );

  return (
    <AuthScreenLayout
      title={t(TRANSLATION_KEYS.authVerifyTitle)}
      subtitle={t(TRANSLATION_KEYS.authVerifyBody)}
    >
      <View style={styles.account}>
        <Text variant="rowTitle" tone="onEspresso">
          {user?.email ?? t(TRANSLATION_KEYS.authAccountEmailUnknown)}
        </Text>
        <View style={styles.status}>
          <MaterialCommunityIcons
            name={VERIFY_STATE_ICONS[state]}
            size={theme.size.iconTiny}
            color={theme.colors[VERIFY_STATE_ICON_COLORS[state]]}
          />
          <Text variant="bodyMuted" tone={VERIFY_STATE_TONES[state]}>
            {t(NOTICE_KEYS[state])}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        {resend.isSuccess ? (
          <Text variant="bodyMuted" tone="positiveOnEspresso">
            {t(TRANSLATION_KEYS.authVerifySentNotice)}
          </Text>
        ) : null}
        <AuthErrorMessage errorKey={resend.errorKey ?? check.errorKey} />
        <PillButton
          tone="cream"
          size="large"
          raised
          icon={AUTH_ICONS.submit}
          label={t(TRANSLATION_KEYS.authVerifyCheckAction)}
          onPress={check.run}
          isPending={check.isPending}
        />
        <PillButton
          tone="lifted"
          label={t(TRANSLATION_KEYS.authVerifyResendAction)}
          onPress={resend.run}
          isPending={resend.isPending}
        />
        <AuthNavigationLink
          action={t(TRANSLATION_KEYS.authVerifyContinueAction)}
          href={ROUTES.home}
          replaces
        />
      </View>
    </AuthScreenLayout>
  );
};
