import type { Animated } from 'react-native';

/**
 * Animated transforms cannot live in a stylesheet, but they still do not
 * belong inside the JSX.
 */
export const scrimStyle = (
  opacity: Animated.AnimatedInterpolation<number>,
): { opacity: Animated.AnimatedInterpolation<number> } => ({ opacity });

export const panelStyle = (
  translateY: Animated.AnimatedInterpolation<number>,
): { transform: { translateY: Animated.AnimatedInterpolation<number> }[] } => ({
  transform: [{ translateY }],
});
