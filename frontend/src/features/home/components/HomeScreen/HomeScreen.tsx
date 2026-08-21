import type { JSX } from 'react';

import { Screen } from '../../../../components/layout';
import { EmptyState } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';

/** Placeholder. The app is a skeleton until product features arrive. */
export const HomeScreen = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Screen>
      <EmptyState
        title={t(TRANSLATION_KEYS.homeEmptyTitle)}
        description={t(TRANSLATION_KEYS.homeEmptyBody)}
      />
    </Screen>
  );
};
