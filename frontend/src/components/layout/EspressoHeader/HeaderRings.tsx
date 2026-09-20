import { useEffect, type JSX } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { CIRCLE } from '../../../constants';
import { useReducedMotion } from '../../../hooks';
import { useTheme } from '../../../theme';

import { HEADER_RINGS_STYLES, headerRingsBox } from './EspressoHeader.styles';
import { HEADER_RINGS_DRIFT_MS } from './headerRings';

const STILL = 0;
const FULL_TURN = 360;
const FOREVER = -1;
const DEGREES = 'deg';

/**
 * The mark behind an espresso block.
 *
 * Three circles pushed off the corner and clipped by the block, turning once
 * every two minutes and twenty seconds. Drawn rather than illustrated, like
 * every other graphic in this app, and painted in the same rule colour the
 * block's own dividers use - a ring that had to be faded to sit right would be
 * one whose colour depended on how many things were drawn behind it.
 *
 * It takes no touches. A decoration that swallowed a tap meant for the row
 * inside the header would be a header nobody could use.
 */
export const HeaderRings = (): JSX.Element => {
  const theme = useTheme();
  const isReducedMotion = useReducedMotion();
  const turn = useSharedValue(STILL);

  useEffect((): void => {
    if (isReducedMotion) {
      turn.value = STILL;

      return;
    }

    turn.value = withRepeat(
      withTiming(FULL_TURN, { duration: HEADER_RINGS_DRIFT_MS, easing: Easing.linear }),
      FOREVER,
    );
  }, [isReducedMotion, turn]);

  const driftStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${String(turn.value)}${DEGREES}` }],
  }));

  const center = theme.size.headerRingsSize / CIRCLE.half;
  const radii = [theme.size.headerRingOuter, theme.size.headerRingMid, theme.size.headerRingInner];

  return (
    <Animated.View
      style={[HEADER_RINGS_STYLES.rings, headerRingsBox(theme), driftStyle]}
      pointerEvents="none"
    >
      <Svg width={theme.size.headerRingsSize} height={theme.size.headerRingsSize}>
        {radii.map((radius: number): JSX.Element => (
          <Circle
            key={radius}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={theme.colors.espressoLine}
            strokeWidth={theme.size.headerRingStroke}
          />
        ))}
      </Svg>
    </Animated.View>
  );
};
