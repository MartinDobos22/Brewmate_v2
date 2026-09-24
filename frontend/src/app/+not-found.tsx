import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { Screen, STACK_SCREEN_EDGES } from '../components/layout';
import { EmptyState } from '../components/ui';
import { NOT_FOUND_ICON, ROUTES } from '../constants';
import { TRANSLATION_KEYS, useTranslation } from '../i18n';

/**
 * Somewhere the app does not have.
 *
 * The way home is the state's own action rather than a link underneath it.
 * Every other empty screen in this app offers its ways out as pills inside
 * the state, and the one screen somebody reaches by accident was the one
 * leaving its exit as a line of blue text below the picture.
 */
export default function NotFoundRoute(): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Screen edges={STACK_SCREEN_EDGES}>
      <EmptyState
        icon={NOT_FOUND_ICON}
        title={t(TRANSLATION_KEYS.titleNotFound)}
        description={t(TRANSLATION_KEYS.notFoundBody)}
        actions={[
          {
            label: t(TRANSLATION_KEYS.notFoundAction),
            tone: 'espresso',
            onPress: (): void => {
              router.replace(ROUTES.home);
            },
          },
        ]}
      />
    </Screen>
  );
}
