import type { JSX } from 'react';

import { Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { DeleteAccountButton } from '../DeleteAccountButton';

/**
 * The way out of the product, in a card of its own.
 *
 * Last on the screen, and directly under the export - the two answer the same
 * question about what this account is, and somebody deciding whether to leave
 * is entitled to see what leaving takes with it before they do it.
 *
 * In the app at all because Apple has required it since 2022 of any app that
 * can create an account.
 */
export const DeleteAccountCard = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.authDeleteAccountTitle)}</Text>
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.authDeleteAccountBody)}
      </Text>
      <DeleteAccountButton />
    </Card>
  );
};
