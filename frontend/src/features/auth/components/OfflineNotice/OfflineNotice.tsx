import type { JSX } from 'react';

import { Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';

/**
 * Shown above every sign-in form while the device is offline, so a failed
 * attempt is explained before it happens instead of after.
 */
export const OfflineNotice = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Card variant="containerHigh">
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.authOfflineTitle)}</Text>
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.authOfflineBody)}
      </Text>
    </Card>
  );
};
