import type { JSX, ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useThemedStyles } from '../../../theme';
import { BottomNavBar, useShowsBottomNav } from '../BottomNavBar';

import { createScreenStyles } from './Screen.styles';
import { TAB_SCREEN_EDGES } from './screenEdges';

export interface ScreenProps {
  readonly children: ReactNode;
  /** Which safe area insets this screen absorbs. */
  readonly edges?: readonly Edge[];
  readonly scrollable?: boolean;
  readonly padded?: boolean;
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
 */
export const Screen = ({
  children,
  edges = TAB_SCREEN_EDGES,
  scrollable = false,
  padded = true,
}: ScreenProps): JSX.Element => {
  const styles = useThemedStyles(createScreenStyles);
  const showsBottomNav = useShowsBottomNav();

  return (
    <SafeAreaView style={styles.root} edges={showsBottomNav ? TAB_SCREEN_EDGES : edges}>
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
      {showsBottomNav ? <BottomNavBar /> : null}
    </SafeAreaView>
  );
};
