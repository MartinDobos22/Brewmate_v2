import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { EmptyState } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';

/** The coffee is in the cupboard now, and the flow says so and stops. */
export const QuickBrewSavedStep = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <EmptyState
      title={t(TRANSLATION_KEYS.quickBrewSavedTitle)}
      description={t(TRANSLATION_KEYS.quickBrewSavedBody)}
      actions={[
        {
          label: t(TRANSLATION_KEYS.quickBrewSavedAction),
          variant: 'primary',
          onPress: (): void => {
            router.replace(ROUTES.home);
          },
        },
      ]}
    />
  );
};
