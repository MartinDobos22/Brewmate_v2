import type { JSX } from 'react';
import { View } from 'react-native';

import { useThemedStyles } from '../../../theme';

import { createProgressBarStyles, progressShare } from './ProgressBar.styles';

export interface ProgressBarProps {
  readonly current: number;
  readonly total: number;
  /** What the bar is measuring, for a screen reader. */
  readonly label: string;
}

const START = 0;

/**
 * How far through something the user is.
 *
 * The two halves are flex weights rather than a measured width, so the bar is
 * correct on the first frame - a progress bar that animates in from empty
 * reads as progress being made, which is a lie when nothing just happened.
 */
export const ProgressBar = ({ current, total, label }: ProgressBarProps): JSX.Element => {
  const styles = useThemedStyles(createProgressBarStyles);

  return (
    <View
      style={styles.track}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: START, max: total, now: current }}
    >
      <View style={[styles.fill, progressShare(current)]} />
      <View style={progressShare(total - current)} />
    </View>
  );
};
