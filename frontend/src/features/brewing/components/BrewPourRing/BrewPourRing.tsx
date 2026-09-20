import type { JSX, ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useTheme, useThemedStyles } from '../../../../theme';
import { POUR_RING } from '../../constants';

import { createBrewPourRingStyles } from './BrewPourRing.styles';
import { PourArc } from './PourArc';

export interface BrewPourRingProps {
  /** How far through the step, between nought and one, or null where it ends on a sight. */
  readonly progress: number | null;
  readonly isRunning: boolean;
  /** What sits in the middle: the countdown, and what the scale should read. */
  readonly children: ReactNode;
}

/**
 * A V60 seen from above, with the pour drawn round its rim.
 *
 * The four faint circles are the cone's own ribs. They are not a scale and
 * nothing is read off them - they are what stops the ring reading as a
 * progress bar that has been bent into a circle, which is what it would
 * otherwise be.
 *
 * A step with no end gets the track and no arc. An arc at nought would say the
 * step had not started and one creeping forward would say it was being timed,
 * and neither is true of "pour until you see it".
 */
export const BrewPourRing = ({ progress, isRunning, children }: BrewPourRingProps): JSX.Element => {
  const styles = useThemedStyles(createBrewPourRingStyles);
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      <Svg width={POUR_RING.size} height={POUR_RING.size}>
        {POUR_RING.guideRadii.map((radius: number): JSX.Element => (
          <Circle
            key={radius}
            cx={POUR_RING.center}
            cy={POUR_RING.center}
            r={radius}
            fill="none"
            stroke={theme.colors.brewSurface}
            strokeWidth={POUR_RING.guideStrokeWidth}
          />
        ))}
        <Circle
          cx={POUR_RING.center}
          cy={POUR_RING.center}
          r={POUR_RING.radius}
          fill="none"
          stroke={theme.colors.brewTrack}
          strokeWidth={POUR_RING.strokeWidth}
        />
        {progress === null ? null : <PourArc progress={progress} isRunning={isRunning} />}
      </Svg>
      <View style={styles.center}>{children}</View>
    </View>
  );
};
