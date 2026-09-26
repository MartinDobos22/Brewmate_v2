import { StyleSheet } from 'react-native';

import type { Theme, ViewStyles } from '../../../../theme';
import { POUR_RING } from '../../constants';

type BrewPourRingStyleMap = ViewStyles<'wrapper' | 'center'>;

export const createBrewPourRingStyles = (theme: Theme): BrewPourRingStyleMap =>
  StyleSheet.create({
    wrapper: { alignSelf: 'center', width: POUR_RING.size, height: POUR_RING.size },
    /**
     * The countdown sits in the ring rather than above it, so the two things
     * being watched - how long is left and how much of the step has gone - are
     * one glance instead of two.
     */
    center: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xxs,
    },
  });
