import type { JSX } from 'react';
import { View } from 'react-native';

import { HEADER_SCREEN_EDGES, Screen } from '../../../../components/layout';
import { useThemedStyles } from '../../../../theme';
import { BrewWeekCard } from '../BrewWeekCard';
import { HomeCupboard } from '../HomeCupboard';
import { HomeHeader } from '../HomeHeader';
import { HomeHintCard } from '../HomeHintCard';
import { TasteCard } from '../TasteCard';

import { createHomeScreenStyles } from './HomeScreen.styles';

/**
 * The home screen: one block that says what to do, then what the account
 * amounts to.
 *
 * The order is the order things repay attention, and it does not change as the
 * account fills up - what to brew, the one thing worth knowing today, what has
 * been brewed and what the app believes, and finally the shelf. What changes
 * is what each of those is able to say: the block leads with a checklist
 * before it can lead with a coffee, and the two cards report a glyph and a
 * sentence before they can report a number.
 *
 * Nothing here is ever an empty frame. A dashboard with nothing in it is the
 * state a product gets judged on, and every piece of this screen either has
 * something to say or says why it does not.
 */
export const HomeScreen = (): JSX.Element => {
  const styles = useThemedStyles(createHomeScreenStyles);

  return (
    <Screen scrollable padded={false} edges={HEADER_SCREEN_EDGES}>
      <HomeHeader />
      <View style={styles.content}>
        <HomeHintCard />
        <View style={styles.cards}>
          <BrewWeekCard />
          <TasteCard />
        </View>
        <HomeCupboard />
      </View>
    </Screen>
  );
};
