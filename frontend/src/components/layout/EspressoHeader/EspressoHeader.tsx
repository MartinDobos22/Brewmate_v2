import type { JSX, ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme, useThemedStyles } from '../../../theme';

import { DriftingRings } from '../../ui';
import { BackButton, BACK_BUTTON_GROUNDS } from '../BackButton';
import { useScreenBack } from '../ScreenBack';

import { createEspressoHeaderStyles, headerInset } from './EspressoHeader.styles';

export interface EspressoHeaderProps {
  /** The one thing this screen most wants read, and nothing else. */
  readonly children: ReactNode;
  /**
   * Drawn on the same line as the way back rather than under it - the badge a
   * flow opens with, which would otherwise be a second round object stacked
   * under the first.
   */
  readonly beside?: ReactNode;
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
 *
 * The way back sits in its top corner wherever there is somewhere to go back
 * to. The block is what reaches the notch, so a button above it would be a
 * strip of page between the glass and a block meant to start there.
 */
export const EspressoHeader = ({ children, beside }: EspressoHeaderProps): JSX.Element => {
  const styles = useThemedStyles(createEspressoHeaderStyles);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const back = useScreenBack();
  const hasTop = back !== null || beside !== undefined;

  return (
    <View style={[styles.block, headerInset(theme, insets.top)]}>
      <DriftingRings size={theme.size.headerRingsSize} color={theme.colors.espressoLine} />
      <View style={styles.content}>
        {hasTop ? (
          <View style={styles.top}>
            {back === null ? null : (
              <BackButton ground={BACK_BUTTON_GROUNDS.espresso} onPress={back} />
            )}
            {beside}
          </View>
        ) : null}
        {children}
      </View>
    </View>
  );
};
