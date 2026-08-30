import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { Button, Card } from '../../../../components/ui';
import { ROUTES } from '../../../../constants';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useAuthSession } from '../../context';
import { useSignOut } from '../../hooks';
import { AuthErrorMessage } from '../AuthErrorMessage';

/**
 * What can be done to the session: confirm the address, or leave it.
 *
 * Who is signed in is answered at the top of the profile screen instead - an
 * address is identity, and identity belongs above what the screen says about
 * that person rather than in a card beside the way out. Deleting is the card
 * after this one, because a card that ends in a second heading is a card
 * asking to be two.
 */
export const AccountCard = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const { needsEmailVerification } = useAuthSession();
  const signOut = useSignOut();

  return (
    <Card>
      {needsEmailVerification ? (
        <Button
          label={t(TRANSLATION_KEYS.authVerifyResendAction)}
          onPress={(): void => {
            router.push(ROUTES.verifyEmail);
          }}
          variant="secondary"
          fullWidth
        />
      ) : null}
      <Button
        label={t(TRANSLATION_KEYS.authSignOutAction)}
        onPress={signOut.run}
        variant="tertiary"
        loading={signOut.isPending}
        fullWidth
      />
      <AuthErrorMessage errorKey={signOut.errorKey} />
    </Card>
  );
};
