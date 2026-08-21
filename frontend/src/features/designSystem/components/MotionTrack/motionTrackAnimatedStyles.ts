import type { Animated } from 'react-native';

/** Animated transforms cannot live in a stylesheet, but not in the JSX either. */
export const dotTransform = (
  translateX: Animated.AnimatedInterpolation<number>,
): { transform: { translateX: Animated.AnimatedInterpolation<number> }[] } => ({
  transform: [{ translateX }],
});
