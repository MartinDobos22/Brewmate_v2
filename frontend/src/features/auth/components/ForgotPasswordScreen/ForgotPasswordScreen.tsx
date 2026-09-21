import { useState, type JSX } from 'react';
import { View } from 'react-native';

import { PillButton, Text } from '../../../../components/ui';
import { ROUTES } from '../../../../constants';
import { useIsOnline } from '../../../../hooks';
import { TRANSLATION_KEYS, useTranslation, type TranslationKey } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { AUTH_ICONS } from '../../constants';
import { useAuthMutation } from '../../hooks';
import { sendPasswordReset, validateEmailAddress } from '../../services';
import { AuthErrorMessage } from '../AuthErrorMessage';
import { AuthNavigationLink } from '../AuthNavigationLink';
import { AuthField } from '../AuthField';
import { AuthScreenLayout } from '../AuthScreenLayout';

import { createForgotPasswordScreenStyles } from './ForgotPasswordScreen.styles';

const EMPTY = '';

/**
 * Asks Firebase to send a reset link. The confirmation is deliberately vague
 * about whether the address has an account - see `sendPasswordReset`.
 */
export const ForgotPasswordScreen = (): JSX.Element => {
  const styles = useThemedStyles(createForgotPasswordScreenStyles);
  const { t } = useTranslation();
  const isOnline = useIsOnline();
  const [email, setEmail] = useState(EMPTY);
  const [emailError, setEmailError] = useState<TranslationKey | null>(null);
  const { run, isPending, isSuccess, errorKey } = useAuthMutation(sendPasswordReset);

  const submit = (): void => {
    const error = validateEmailAddress(email.trim());

    setEmailError(error);

    if (error === null) {
      run(email);
    }
  };

  return (
    <AuthScreenLayout
      title={t(TRANSLATION_KEYS.authResetTitle)}
      subtitle={t(TRANSLATION_KEYS.authResetBody)}
    >
      <View style={styles.form}>
        <AuthField
          label={t(TRANSLATION_KEYS.authEmailLabel)}
          icon={AUTH_ICONS.email}
          placeholder={t(TRANSLATION_KEYS.authEmailPlaceholder)}
          value={email}
          onChangeText={setEmail}
          errorText={emailError === null ? undefined : t(emailError)}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          disabled={isPending}
        />
        <AuthErrorMessage errorKey={errorKey} />
        {isSuccess ? (
          <Text variant="bodyMuted" tone="positiveOnEspresso">
            {t(TRANSLATION_KEYS.authResetSent)}
          </Text>
        ) : null}
        <PillButton
          tone="cream"
          size="large"
          raised
          icon={AUTH_ICONS.submit}
          label={t(TRANSLATION_KEYS.authResetAction)}
          onPress={submit}
          isPending={isPending}
          disabled={!isOnline}
        />
      </View>
      <AuthNavigationLink action={t(TRANSLATION_KEYS.authResetBackAction)} href={ROUTES.signIn} />
    </AuthScreenLayout>
  );
};
