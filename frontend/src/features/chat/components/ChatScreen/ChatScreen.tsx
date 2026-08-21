import type { JSX } from 'react';

import { Screen } from '../../../../components/layout';
import { EmptyState } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';

/** Placeholder. The app is a skeleton until product features arrive. */
export const ChatScreen = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Screen>
      <EmptyState
        title={t(TRANSLATION_KEYS.chatEmptyTitle)}
        description={t(TRANSLATION_KEYS.chatEmptyBody)}
      />
    </Screen>
  );
};
