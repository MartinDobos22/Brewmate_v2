import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { Button, Card, Text } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';

/**
 * The shop scanner, on the home screen and above everything else.
 *
 * It is the one thing a brand-new account can use in the first minute and get
 * something real back from - no cupboard, no history, only the questionnaire.
 * Burying that three taps inside the inventory would be hiding the only door
 * that is already open.
 */
export const ScanPromptCard = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Card variant="containerHigh">
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.homeScanTitle)}</Text>
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.homeScanBody)}
      </Text>
      <Button
        label={t(TRANSLATION_KEYS.homeScanAction)}
        fullWidth
        onPress={(): void => {
          router.push(ROUTES.scan);
        }}
      />
    </Card>
  );
};
