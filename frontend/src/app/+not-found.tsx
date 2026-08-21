import { Link } from 'expo-router';
import type { JSX } from 'react';

import { Screen, STACK_SCREEN_EDGES } from '../components/layout';
import { EmptyState } from '../components/ui';
import { ROUTES } from '../constants';
import { TRANSLATION_KEYS, useTranslation } from '../i18n';

export default function NotFoundRoute(): JSX.Element {
  const { t } = useTranslation();

  return (
    <Screen edges={STACK_SCREEN_EDGES}>
      <EmptyState
        title={t(TRANSLATION_KEYS.titleNotFound)}
        description={t(TRANSLATION_KEYS.notFoundBody)}
      />
      <Link href={ROUTES.home}>{t(TRANSLATION_KEYS.notFoundAction)}</Link>
    </Screen>
  );
}
