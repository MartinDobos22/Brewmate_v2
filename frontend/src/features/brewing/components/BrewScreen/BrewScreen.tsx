import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { Screen } from '../../../../components/layout';
import { Button, Card, Text } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { EquipmentSetSwitcher } from '../../../inventory/components';
import { AvailableMethodList } from '../AvailableMethodList';

/**
 * The screen before a brew.
 *
 * Two questions get answered here before anything else: where the user is
 * standing, and what they can make there. The set switch is one tap because
 * it changes every time somebody brews somewhere other than home.
 *
 * The way out at the bottom is the important one for a new account: brewing
 * must not depend on having written a coffee down first.
 */
export const BrewScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Screen scrollable>
      <EquipmentSetSwitcher />
      <AvailableMethodList />
      <Card>
        <Text variant="titleMedium">{t(TRANSLATION_KEYS.brewEmptyTitle)}</Text>
        <Text variant="bodySmall" tone="muted">
          {t(TRANSLATION_KEYS.brewEmptyBody)}
        </Text>
        <Button
          label={t(TRANSLATION_KEYS.quickBrewTitle)}
          fullWidth
          onPress={(): void => {
            router.push(ROUTES.quickBrew);
          }}
        />
      </Card>
    </Screen>
  );
};
