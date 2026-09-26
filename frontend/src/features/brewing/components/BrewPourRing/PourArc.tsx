import { useEffect, type JSX } from 'react';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Circle } from 'react-native-svg';

import { useTheme } from '../../../../theme';
import { BREW_TICK_MS, POUR_RING } from '../../constants';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const COMPLETE = 1;

/**
 * How far the arc may move in one tick before it is treated as a jump.
 *
 * At an ordinary pace a tick moves it under one percent of the ring. Anything
 * past this share is a step change, a skip, a restart, or a phone coming back
 * from somebody's pocket - and all four want the arc where the brew actually
 * is, now, rather than a quarter-second sweep towards it.
 */
const CATCH_UP_SHARE = 0.05;

interface PourArcProps {
  /** How far through the step, between nought and one. */
  readonly progress: number;
  readonly isRunning: boolean;
}

interface PourArcAnimatedProps {
  readonly strokeDashoffset: number;
}

/**
 * The arc, driven by the brew's own clock.
 *
 * This is the one piece of motion on the screen that carries information, and
 * the reason it is not a repeating animation: a loop would keep sweeping while
 * the brew was paused, would start over at each step whatever the clock said,
 * and would be exactly wrong after the app spent the bloom in the background.
 * What is animated here is only the quarter second between one reading of the
 * clock and the next, so the arc is always on its way to the truth rather than
 * telling a story of its own.
 */
export const PourArc = ({ progress, isRunning }: PourArcProps): JSX.Element => {
  const theme = useTheme();
  const offset = useSharedValue(POUR_RING.circumference);

  useEffect((): void => {
    const target = POUR_RING.circumference * (COMPLETE - progress);
    const isJump = Math.abs(offset.value - target) > POUR_RING.circumference * CATCH_UP_SHARE;

    offset.value =
      isJump || !isRunning
        ? target
        : withTiming(target, { duration: BREW_TICK_MS, easing: Easing.linear });
  }, [progress, isRunning, offset]);

  const animatedProps = useAnimatedProps<PourArcAnimatedProps>((): PourArcAnimatedProps => ({
    strokeDashoffset: offset.value,
  }));

  return (
    <AnimatedCircle
      cx={POUR_RING.center}
      cy={POUR_RING.center}
      r={POUR_RING.radius}
      fill="none"
      stroke={theme.colors.brewArc}
      strokeWidth={POUR_RING.strokeWidth}
      strokeLinecap="round"
      strokeDasharray={POUR_RING.circumference}
      transform={POUR_RING.startTransform}
      animatedProps={animatedProps}
    />
  );
};
