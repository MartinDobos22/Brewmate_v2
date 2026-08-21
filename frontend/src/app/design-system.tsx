import { Redirect } from 'expo-router';
import type { JSX } from 'react';

import { APP_CONFIG, ROUTES } from '../constants';
import { DesignSystemScreen } from '../features/designSystem';

/** Development only: in a production build this route redirects to home. */
export default function DesignSystemRoute(): JSX.Element {
  if (!APP_CONFIG.designSystemScreenEnabled) {
    return <Redirect href={ROUTES.home} />;
  }

  return <DesignSystemScreen />;
}
