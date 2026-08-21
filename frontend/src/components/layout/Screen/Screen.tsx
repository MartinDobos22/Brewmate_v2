import type { JSX, ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useThemedStyles } from '../../../theme';

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
 * Dynamic Island and the Android navigation bar, and applies the screen edge.
 */
export const Screen = ({
  children,
  edges = TAB_SCREEN_EDGES,
  scrollable = false,
  padded = true,
}: ScreenProps): JSX.Element => {
  const styles = useThemedStyles(createScreenStyles);

  return (
    <SafeAreaView style={styles.root} edges={edges}>
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
    </SafeAreaView>
  );
};
