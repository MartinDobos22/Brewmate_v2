import { StyleSheet, type ViewStyle } from 'react-native';

import type { Theme, ViewStyles } from '../../../theme';

type SliderStyleMap = ViewStyles<
  'wrapper' | 'header' | 'label' | 'touchArea' | 'track' | 'fill' | 'thumb' | 'bounds' | 'disabled'
>;

/**
 * The thumb is the one circle allowed outside an avatar: it is a control, not
 * a shape - and it carries a ring of the surface it sits on plus a shadow, so
 * it reads as something to take hold of rather than as a dot on a line.
 */
export const createSliderStyles = (theme: Theme): SliderStyleMap =>
  StyleSheet.create({
    wrapper: { gap: theme.spacing.sm, alignSelf: 'stretch' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    label: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
    touchArea: { height: theme.size.minTouchTarget, justifyContent: 'center' },
    track: {
      height: theme.size.sliderTrackHeight,
      borderRadius: theme.radius.xs,
      backgroundColor: theme.colors.surfaceDim,
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
      borderRadius: theme.shape.pill,
      backgroundColor: theme.colors.espresso,
      borderWidth: theme.borderWidth.thick,
      borderColor: theme.colors.surface,
      shadowColor: theme.colors.espresso,
      ...theme.elevation.card,
    },
    /** What the two ends of the track mean, which a slider cannot say itself. */
    bounds: { flexDirection: 'row', justifyContent: 'space-between' },
    disabled: { opacity: theme.opacity.disabled },
  });

/**
 * Track geometry depends on the measured width, so it cannot live in a
 * stylesheet. It is still built here rather than inside the JSX.
 */
export const sliderFillWidth = (width: number): ViewStyle => ({ width });

export const sliderThumbOffset = (left: number): ViewStyle => ({ left });
