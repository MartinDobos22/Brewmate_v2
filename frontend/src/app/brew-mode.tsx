import type { JSX } from 'react';

import { BrewModeScreen } from '../features/brewing';

/** Hands-free brewing. Route files render one screen and nothing else. */
export default function BrewModeRoute(): JSX.Element {
  return <BrewModeScreen />;
}
