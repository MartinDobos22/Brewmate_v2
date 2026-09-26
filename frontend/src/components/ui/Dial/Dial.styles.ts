import { StyleSheet, type ViewStyle } from 'react-native';

import type { ViewStyles } from '../../../theme';

type DialStyleMap = ViewStyles<'center'>;

/**
 * Built once rather than per theme: a dial's geometry is the same in both
 * schemes, and every colour it draws with is handed to it.
 */
export const DIAL_STYLES: DialStyleMap = StyleSheet.create({
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/** The square the ring is drawn in, which only exists once a size is known. */
export const dialBox = (size: number): ViewStyle => ({ width: size, height: size });
