import type { JSX } from 'react';

import { RecipeTimelineScreen } from '../features/history';

/** Every version of one recipe line, with the cups and notes under each. */
export default function TimelineRoute(): JSX.Element {
  return <RecipeTimelineScreen />;
}
