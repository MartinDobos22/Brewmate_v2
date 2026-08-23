import type { JSX } from 'react';

import { Screen } from '../../../../components/layout';
import { BrewHistoryCard } from '../BrewHistoryCard';
import { GettingStartedCard } from '../GettingStartedCard';
import { QuickBrewPromptCard } from '../QuickBrewPromptCard';
import { ScanPromptCard } from '../ScanPromptCard';

/**
 * The first screen of an account with nothing in it.
 *
 * Deliberately not a dashboard: a dashboard with no data is a set of empty
 * frames, and that is the first impression the whole product would be judged
 * on. Instead it is three things to do, in the order they repay the effort -
 * the shop scanner first, because it is the one that works before Brewmate
 * knows anything at all.
 *
 * Every card here is honest about an account that is still empty, so the same
 * screen carries on working as it fills up.
 */
export const HomeScreen = (): JSX.Element => (
  <Screen scrollable>
    <GettingStartedCard />
    <ScanPromptCard />
    <QuickBrewPromptCard />
    <BrewHistoryCard />
  </Screen>
);
