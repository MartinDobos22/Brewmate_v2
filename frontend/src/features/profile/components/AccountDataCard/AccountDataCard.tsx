import type { JSX } from 'react';

import { Card, PillButton, SectionHeading, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useExportAccount } from '../../hooks';

/**
 * The right to a copy, answered with a button.
 *
 * In the app rather than by email, and delivered as a file rather than as a
 * promise to send one: a request that ends in "pošleme ti odkaz" is one people
 * give up on, and the whole point of Article 20 is that the copy is actually
 * obtainable.
 *
 * It says out loud that this is the same set of rows deletion erases. Those
 * two answers describe the same account, and a person deciding whether to
 * leave is entitled to see what leaving takes with it before they do it.
 */
export const AccountDataCard = (): JSX.Element => {
  const { t } = useTranslation();
  const exportAccount = useExportAccount();

  return (
    <Card>
      <SectionHeading
        title={t(TRANSLATION_KEYS.privacyTitle)}
        caption={t(TRANSLATION_KEYS.privacyExportBody)}
        placement="card"
      />
      <PillButton
        tone="surface"
        label={t(
          exportAccount.isPending
            ? TRANSLATION_KEYS.privacyExportPreparing
            : TRANSLATION_KEYS.privacyExportAction,
        )}
        fullWidth
        isPending={exportAccount.isPending}
        onPress={(): void => {
          exportAccount.mutate();
        }}
      />
      {exportAccount.isError ? (
        <Text variant="captionSmall" tone="tertiary">
          {t(TRANSLATION_KEYS.privacyExportFailed)}
        </Text>
      ) : null}
      <Text variant="captionSmall" tone="muted">
        {t(TRANSLATION_KEYS.privacyDeleteNote)}
      </Text>
    </Card>
  );
};
