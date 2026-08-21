import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { Button, Card, Text } from '../../../../components/ui';
import { ROUTES } from '../../../../constants';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useAuthSession } from '../../context';
import { useCurrentUser, useSignOut } from '../../hooks';
import { AuthErrorMessage } from '../AuthErrorMessage';
import { DeleteAccountButton } from '../DeleteAccountButton';

/**
 * The account block on the profile screen: who is signed in, whether the
 * address is confirmed, and the two ways out - signing out and deleting.
 *
 * The address comes from the API rather than from Firebase, which is also what
 * makes the backend user visible the moment it is provisioned.
 */
export const AccountCard = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, needsEmailVerification } = useAuthSession();
  const { data: currentUser } = useCurrentUser();
  const signOut = useSignOut();
  const email = currentUser?.email ?? user?.email ?? null;

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.authAccountTitle)}</Text>
      <Text variant="bodyMedium">{email ?? t(TRANSLATION_KEYS.authAccountEmailUnknown)}</Text>
      <Text variant="bodySmall" tone={needsEmailVerification ? 'muted' : 'secondary'}>
        {t(
          needsEmailVerification
            ? TRANSLATION_KEYS.authVerifyPendingNotice
            : TRANSLATION_KEYS.authVerifiedNotice,
        )}
      </Text>
      {needsEmailVerification ? (
        <Button
          label={t(TRANSLATION_KEYS.authVerifyResendAction)}
          onPress={(): void => {
            router.push(ROUTES.verifyEmail);
          }}
          variant="tertiary"
          fullWidth
        />
      ) : null}
      <Button
        label={t(TRANSLATION_KEYS.authSignOutAction)}
        onPress={signOut.run}
        variant="secondary"
        loading={signOut.isPending}
        fullWidth
      />
      <AuthErrorMessage errorKey={signOut.errorKey} />
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.authDeleteAccountTitle)}</Text>
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.authDeleteAccountBody)}
      </Text>
      <DeleteAccountButton />
    </Card>
  );
};
