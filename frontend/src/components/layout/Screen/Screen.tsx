import type { JSX, ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useThemedStyles } from '../../../theme';
import { BottomNavBar, useShowsBottomNav } from '../BottomNavBar';
import { ScreenBackScope, type BackAction } from '../ScreenBack';
import { ScreenTopBar } from '../ScreenTopBar';

import { createScreenStyles } from './Screen.styles';
import { TAB_SCREEN_EDGES, claimsTopEdge, withoutBottomEdge } from './screenEdges';
import { DEFAULT_SCREEN_GROUND, SCREEN_BACK_GROUNDS, type ScreenGround } from './screenGrounds';

export interface ScreenProps {
  readonly children: ReactNode;
  /** Which safe area insets this screen absorbs. */
  readonly edges?: readonly Edge[];
  readonly scrollable?: boolean;
  readonly padded?: boolean;
  /**
   * Which ground this screen is painted on. Only brew mode asks for anything
   * but the default, and it asks because it is dark in both colour schemes.
   */
  readonly ground?: ScreenGround;
  /**
   * A stage inside this screen to go back to before leaving it - the camera
   * behind a label form, the question behind a list. Absent, "späť" is the
   * navigator's.
   */
  readonly onBack?: BackAction;
}

/**
 * Every screen starts here: it paints the background, honours the notch, the
 * Dynamic Island and the Android navigation bar, applies the screen edge, and
 * - on everything the tab navigator does not already reach - hangs the four
 * destinations along the bottom.
 *
 * The bar is decided here rather than asked for, because "every screen except
 * these" is a rule about the application, and a prop is a rule somebody
 * forgets on the next screen they add. Where it appears it takes the bottom
 * inset for itself: the gesture bar's height belongs to whatever is actually
 * against the bottom edge, and a screen that claimed it as well would leave a
 * strip of background under the bar.
 *
 * That is subtracted from whatever the screen asked for rather than replacing
 * it, because the two insets are separate questions. A screen led by an
 * espresso block has already given the top away to the block, and a bar
 * appearing at the other end is no reason to take it back.
 *
 * The way back is decided here for the same reason the bar is: every screen
 * gets one wherever there is somewhere to go back to, and nobody has to ask.
 * Where it is drawn follows the top inset. A screen that starts into content
 * gets it in a row above that content; one led by a block gets it inside the
 * block, which reads it from here.
 */
export const Screen = ({
  children,
  edges = TAB_SCREEN_EDGES,
  scrollable = false,
  padded = true,
  ground = DEFAULT_SCREEN_GROUND,
  onBack,
}: ScreenProps): JSX.Element => {
  const styles = useThemedStyles(createScreenStyles);
  const showsBottomNav = useShowsBottomNav();

  return (
    <SafeAreaView
      style={[styles.root, styles[ground]]}
      edges={showsBottomNav ? withoutBottomEdge(edges) : edges}
    >
      <ScreenBackScope onBack={onBack}>
        {claimsTopEdge(edges) ? <ScreenTopBar ground={SCREEN_BACK_GROUNDS[ground]} /> : null}
        {scrollable ? (
          <ScrollView
            style={styles.content}
            contentContainerStyle={[styles.grow, padded && styles.padded]}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.content, padded && styles.padded]}>{children}</View>
        )}
      </ScreenBackScope>
      {showsBottomNav ? <BottomNavBar /> : null}
    </SafeAreaView>
  );
};
