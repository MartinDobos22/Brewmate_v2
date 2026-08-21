import { StyleSheet, type ViewStyle } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type SliderStyleMap = ViewStyles<
  'wrapper' | 'header' | 'touchArea' | 'track' | 'fill' | 'thumb' | 'disabled'
>;

/** The thumb is the one circle allowed outside an avatar: it is a control, not a shape. */
export const createSliderStyles = (theme: Theme): SliderStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.sm, alignSelf: 'stretch' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
    touchArea: { height: theme.size.minTouchTarget, justifyContent: 'center' },
    track: {
      height: theme.size.sliderTrackHeight,
      borderRadius: theme.radius.xs,
      backgroundColor: theme.colors.surfaceContainerHigh,
    },
    fill: {
      height: theme.size.sliderTrackHeight,
      borderRadius: theme.radius.xs,
      backgroundColor: theme.colors.primary,
    },
    thumb: {
      position: 'absolute',
      width: theme.size.sliderThumbSize,
      height: theme.size.sliderThumbSize,
      borderRadius: theme.shape.progressRing,
      backgroundColor: theme.colors.primary,
      borderWidth: theme.borderWidth.thick,
      borderColor: theme.colors.surface,
    },
    disabled: { opacity: theme.opacity.disabled },
  });

/**
 * Track geometry depends on the measured width, so it cannot live in a
 * stylesheet. It is still built here rather than inside the JSX.
 */
export const sliderFillWidth = (width: number): ViewStyle => ({ width });

export const sliderThumbOffset = (left: number): ViewStyle => ({ left });
