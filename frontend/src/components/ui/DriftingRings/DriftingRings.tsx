import { useEffect, type JSX } from 'react';
import { type ColorValue } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { CIRCLE, RINGS } from '../../../constants';
import { useReducedMotion } from '../../../hooks';
import { useTheme } from '../../../theme';

import { DRIFTING_RINGS_STYLES, ringPlacement } from './DriftingRings.styles';
import { DEFAULT_RING_PLACEMENT, RINGS_DRIFT_MS, type RingPlacement } from './driftingRings';

const STILL = 0;
const FULL_TURN = 360;
const FOREVER = -1;
const DEGREES = 'deg';

export interface DriftingRingsProps {
  readonly size: number;
  readonly color: ColorValue;
  readonly placement?: RingPlacement;
}

/**
 * The app's own mark: three concentric circles pushed out of a corner and
 * clipped by the block they sit behind.
 *
 * Drawn rather than illustrated, like every other graphic here - an
 * illustration has a fixed palette and a fixed density and would be wrong in
 * one of the two colour schemes the day it was added. It turns once every two
 * and a half minutes, and stands still when the phone asks for reduced motion.
 *
 * It takes no touches. A decoration that swallowed a tap meant for the card it
 * sits behind would be a card nobody could use.
 */
export const DriftingRings = ({
  size,
  color,
  placement = DEFAULT_RING_PLACEMENT,
}: DriftingRingsProps): JSX.Element => {
  const theme = useTheme();
  const isReducedMotion = useReducedMotion();
  const turn = useSharedValue(STILL);

  useEffect((): void => {
    if (isReducedMotion) {
      turn.value = STILL;

      return;
    }

    turn.value = withRepeat(
      withTiming(FULL_TURN, { duration: RINGS_DRIFT_MS, easing: Easing.linear }),
      FOREVER,
    );
  }, [isReducedMotion, turn]);

  const driftStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${String(turn.value)}${DEGREES}` }],
  }));

  const center = size / CIRCLE.half;

  return (
    <Animated.View
      style={[DRIFTING_RINGS_STYLES.rings, ringPlacement(size, placement), driftStyle]}
      pointerEvents="none"
    >
      <Svg width={size} height={size}>
        {RINGS.radii.map((share: number): JSX.Element => (
          <Circle
            key={share}
            cx={center}
            cy={center}
            r={size * share}
            fill="none"
            stroke={color}
            strokeWidth={theme.size.ringStroke}
          />
        ))}
      </Svg>
    </Animated.View>
  );
};
