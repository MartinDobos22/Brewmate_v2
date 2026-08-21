import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { Screen } from '../../../../components/layout';
import { Button, Card, Text } from '../../../../components/ui';
import { APP_CONFIG } from '../../../../constants/config';
import { ROUTES } from '../../../../constants/routes';
import { AccountCard } from '../../../auth';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { AppearancePicker } from '../AppearancePicker';

/**
 * Infrastructure content only: the account, the theme switch, plus the way
 * into the design system while developing.
 */
export const ProfileScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Screen scrollable>
      <AccountCard />
      <Card>
        <Text variant="titleMedium">{t(TRANSLATION_KEYS.profileAppearanceTitle)}</Text>
        <AppearancePicker />
      </Card>
      {APP_CONFIG.designSystemScreenEnabled ? (
        <Card>
          <Text variant="titleMedium">{t(TRANSLATION_KEYS.profileDeveloperTitle)}</Text>
          <Button
            label={t(TRANSLATION_KEYS.profileOpenDesignSystem)}
            variant="tertiary"
            onPress={(): void => {
              router.push(ROUTES.designSystem);
            }}
          />
        </Card>
      ) : null}
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.profileEmptyBody)}
      </Text>
    </Screen>
  );
};
