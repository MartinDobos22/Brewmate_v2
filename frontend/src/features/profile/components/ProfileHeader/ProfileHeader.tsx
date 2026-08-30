import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { useAuthSession, useCurrentUser } from '../../../auth';

import { createProfileHeaderStyles } from './ProfileHeader.styles';

/**
 * Who is signed in, above everything the screen has to say about them.
 *
 * Identity only - no buttons. The screen used to open on a bar chart, which
 * left the reader working out for several seconds whose taste they were
 * looking at, and it kept the address buried in a card seven scrolls down
 * beside the two ways out of the product. What can be done to the account
 * stays in the account group at the bottom, where somebody goes deliberately.
 *
 * The address comes from the API rather than from Firebase, which is also what
 * makes the backend user visible the moment it is provisioned.
 */
export const ProfileHeader = (): JSX.Element => {
  const styles = useThemedStyles(createProfileHeaderStyles);
  const { t } = useTranslation();
  const { user, needsEmailVerification } = useAuthSession();
  const { data: currentUser } = useCurrentUser();
  const email = currentUser?.email ?? user?.email ?? null;

  return (
    <View style={styles.wrapper}>
      <Text variant="headlineSmall">{t(TRANSLATION_KEYS.profileHeaderTitle)}</Text>
      <Text variant="bodyMedium" numberOfLines={1}>
        {email ?? t(TRANSLATION_KEYS.authAccountEmailUnknown)}
      </Text>
      <Text variant="labelSmall" tone={needsEmailVerification ? 'muted' : 'secondary'}>
        {t(
          needsEmailVerification
            ? TRANSLATION_KEYS.authVerifyPendingNotice
            : TRANSLATION_KEYS.authVerifiedNotice,
        )}
      </Text>
    </View>
  );
};
