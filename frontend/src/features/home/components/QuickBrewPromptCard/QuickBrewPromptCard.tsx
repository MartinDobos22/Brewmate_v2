import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { Button, Card, Text } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';

/** Brewing without writing anything down first, one tap from the home screen. */
export const QuickBrewPromptCard = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.homeQuickBrewTitle)}</Text>
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.homeQuickBrewBody)}
      </Text>
      <Button
        label={t(TRANSLATION_KEYS.homeQuickBrewAction)}
        variant="secondary"
        fullWidth
        onPress={(): void => {
          router.push(ROUTES.quickBrew);
        }}
      />
    </Card>
  );
};
