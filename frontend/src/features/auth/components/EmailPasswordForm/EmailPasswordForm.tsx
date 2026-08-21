import { useState, type JSX, type ReactNode } from 'react';
import { View } from 'react-native';

import { Button, Input } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation, type TranslationKey } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import {
  hasCredentialError,
  validateCredentials,
  type CredentialErrors,
  type EmailCredentials,
} from '../../services';
import { AuthErrorMessage } from '../AuthErrorMessage';

import { NO_CREDENTIAL_ERRORS } from './credentialErrorState';
import { createEmailPasswordFormStyles } from './EmailPasswordForm.styles';

export interface EmailPasswordFormProps {
  readonly submitLabel: string;
  readonly onSubmit: (credentials: EmailCredentials) => void;
  readonly isPending: boolean;
  readonly errorKey: TranslationKey | null;
  /** Blocks the form while the device is offline. */
  readonly disabled?: boolean;
  readonly footer?: ReactNode;
}

const EMPTY = '';

/**
 * The e-mail and password pair, shared by signing in and registering.
 *
 * The form validates itself before it calls anything, so a missing field or a
 * short password is answered instantly and never becomes a provider error.
 */
export const EmailPasswordForm = ({
  submitLabel,
  onSubmit,
  isPending,
  errorKey,
  disabled = false,
  footer,
}: EmailPasswordFormProps): JSX.Element => {
  const styles = useThemedStyles(createEmailPasswordFormStyles);
  const { t } = useTranslation();
  const [email, setEmail] = useState(EMPTY);
  const [password, setPassword] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<CredentialErrors>(NO_CREDENTIAL_ERRORS);

  const submit = (): void => {
    const credentials: EmailCredentials = { email, password };
    const errors = validateCredentials(credentials);

    setFieldErrors(errors);

    if (!hasCredentialError(errors)) {
      onSubmit(credentials);
    }
  };

  return (
    <View style={styles.form}>
      <Input
        label={t(TRANSLATION_KEYS.authEmailLabel)}
        placeholder={t(TRANSLATION_KEYS.authEmailPlaceholder)}
        value={email}
        onChangeText={setEmail}
        errorText={fieldErrors.email === null ? undefined : t(fieldErrors.email)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        disabled={isPending}
      />
      <Input
        label={t(TRANSLATION_KEYS.authPasswordLabel)}
        placeholder={t(TRANSLATION_KEYS.authPasswordPlaceholder)}
        value={password}
        onChangeText={setPassword}
        errorText={fieldErrors.password === null ? undefined : t(fieldErrors.password)}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
        textContentType="password"
        disabled={isPending}
      />
      <AuthErrorMessage errorKey={errorKey} />
      <Button
        label={submitLabel}
        onPress={submit}
        loading={isPending}
        disabled={disabled}
        fullWidth
      />
      {footer === undefined ? null : <View style={styles.footer}>{footer}</View>}
    </View>
  );
};
