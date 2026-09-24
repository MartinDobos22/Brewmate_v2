import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type FlowHeaderStyleMap = ViewStyles<'badge' | 'text'>;

/**
 * What a multi-step flow is, in the block at the top of it.
 *
 * The badge carries the same glyph as whatever sent somebody here - the home
 * screen's scanner button, the profile's import row - so pressing one and
 * arriving at the other is recognisably the same errand. Underneath, the one
 * sentence that says what the flow needs and what it will give back.
 */
export const createFlowHeaderStyles = (theme: Theme): FlowHeaderStyleMap =>
  StyleSheet.create({
    badge: {
      width: theme.size.scanBadgeSize,
      height: theme.size.scanBadgeSize,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.espressoLift,
    },
    text: { gap: theme.spacing.md },
  });
