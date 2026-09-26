import type { JSX, ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme, useThemedStyles } from '../../../theme';

import { DriftingRings } from '../../ui';

import { createEspressoHeaderStyles, headerInset } from './EspressoHeader.styles';

export interface EspressoHeaderProps {
  /** The one thing this screen most wants read, and nothing else. */
  readonly children: ReactNode;
}

/**
 * The block at the top of a screen that always holds its single most important
 * thing - the recommendation, the coffee, the identity, the question.
 *
 * It starts at the glass and takes the notch's inset as its own padding, which
 * is what makes it read as a block laid over the screen rather than as a card
 * floating under the status bar. Square at the top and rounded where it ends.
 *
 * The rule it establishes is that the slot is never empty: where there is no
 * recommendation to lead with it holds the three things to do instead. A dark
 * block with nothing in it would be a screen announcing that it has nothing to
 * say, at the loudest point on the page.
 */
export const EspressoHeader = ({ children }: EspressoHeaderProps): JSX.Element => {
  const styles = useThemedStyles(createEspressoHeaderStyles);
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.block, headerInset(theme, insets.top)]}>
      <DriftingRings size={theme.size.headerRingsSize} color={theme.colors.espressoLine} />
      <View style={styles.content}>{children}</View>
    </View>
  );
};
