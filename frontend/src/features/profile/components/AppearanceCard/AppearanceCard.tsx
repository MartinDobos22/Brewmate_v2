import type { JSX } from 'react';

import { Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { AppearancePicker } from '../AppearancePicker';

/** The scheme picker, in a card of its own rather than assembled in the screen. */
export const AppearanceCard = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.profileAppearanceTitle)}</Text>
      <AppearancePicker />
    </Card>
  );
};
