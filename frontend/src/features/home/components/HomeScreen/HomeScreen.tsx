import type { JSX } from 'react';

import { Screen, TileRow } from '../../../../components/layout';
import { BrewHistoryCard } from '../BrewHistoryCard';
import { BrewTile } from '../BrewTile';
import { GettingStartedCard } from '../GettingStartedCard';
import { HomeDataRow } from '../HomeDataRow';
import { HomeGreeting } from '../HomeGreeting';
import { HomeHintTile } from '../HomeHintTile';
import { QuickBrewTile } from '../QuickBrewTile';
import { ScanTile } from '../ScanTile';
import { TasteProfileTile } from '../TasteProfileTile';

/**
 * The home screen, as a grid rather than a column.
 *
 * The order is the order things repay attention, and it does not change as the
 * account fills up: what to do about the coffee right now, then the two ways
 * to start brewing, then what Brewmate believes and what it has been told.
 * Tiles rather than cards because these are destinations - a card invites
 * reading, and nothing on this screen is worth reading for its own sake.
 *
 * Three of the rows are allowed to be absent. The getting-started card leaves
 * once its three steps are done, the hint waits until it knows enough to be
 * right, and the reporting row does not appear until there is something to
 * report. What is left on a brand-new account is still four things to do - not
 * a dashboard with nothing in its frames, which is the state a product gets
 * judged on.
 */
export const HomeScreen = (): JSX.Element => (
  <Screen scrollable>
    <HomeGreeting />
    <GettingStartedCard />
    <HomeHintTile />
    <TileRow>
      <ScanTile />
    </TileRow>
    <TileRow>
      <QuickBrewTile />
      <BrewTile />
    </TileRow>
    <TileRow>
      <TasteProfileTile />
    </TileRow>
    <HomeDataRow />
    <BrewHistoryCard />
  </Screen>
);
