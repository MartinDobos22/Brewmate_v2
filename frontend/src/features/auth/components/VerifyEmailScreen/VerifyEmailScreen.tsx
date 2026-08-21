import { useRouter } from 'expo-router';
import { useCallback, useState, type JSX } from 'react';
import { View } from 'react-native';

import { Button, Card, Text } from '../../../../components/ui';
import { ROUTES } from '../../../../constants';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { useAuthSession } from '../../context';
import { useAuthAction } from '../../hooks';
import { refreshEmailVerification, resendVerificationEmail } from '../../services';
import { AuthErrorMessage } from '../AuthErrorMessage';
import { AuthScreenLayout } from '../AuthScreenLayout';

import { createVerifyEmailScreenStyles } from './VerifyEmailScreen.styles';

/**
 * Shown once, right after registering with an e-mail address. It nudges rather
 * than blocks: the account works either way, and the user can walk straight
 * into the app.
 */
export const VerifyEmailScreen = (): JSX.Element => {
  const styles = useThemedStyles(createVerifyEmailScreenStyles);
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuthSession();
  const [isVerified, setIsVerified] = useState(user?.emailVerified ?? false);
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
      <Card>
        <Text variant="titleMedium">
          {user?.email ?? t(TRANSLATION_KEYS.authAccountEmailUnknown)}
        </Text>
        <Text variant="bodySmall" tone={isVerified ? 'secondary' : 'muted'}>
          {t(
            isVerified
              ? TRANSLATION_KEYS.authVerifiedNotice
              : TRANSLATION_KEYS.authVerifyPendingNotice,
          )}
        </Text>
      </Card>
      <View style={styles.actions}>
        {resend.isSuccess ? (
          <Text variant="bodySmall" tone="secondary">
            {t(TRANSLATION_KEYS.authVerifySentNotice)}
          </Text>
        ) : null}
        <AuthErrorMessage errorKey={resend.errorKey ?? check.errorKey} />
        <Button
          label={t(TRANSLATION_KEYS.authVerifyCheckAction)}
          onPress={check.run}
          loading={check.isPending}
          fullWidth
        />
        <Button
          label={t(TRANSLATION_KEYS.authVerifyResendAction)}
          onPress={resend.run}
          variant="tertiary"
          loading={resend.isPending}
          fullWidth
        />
        <Button
          label={t(TRANSLATION_KEYS.authVerifyContinueAction)}
          onPress={(): void => {
            router.replace(ROUTES.home);
          }}
          variant="secondary"
          fullWidth
        />
      </View>
    </AuthScreenLayout>
  );
};
