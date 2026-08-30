import type { JSX } from 'react';
import { View } from 'react-native';

import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';

import { createBrewStepProgressStyles, segmentWidth } from './BrewStepProgress.styles';

const NONE = 0;
const KEY_PREFIX = 'pour-';
const PREVIOUS = 1;

export interface BrewStepProgressProps {
  /** Which pour is happening, counting from one. */
  readonly stepNumber: number;
  readonly total: number;
}

/**
 * How much of the brew is left, as a glance rather than a number.
 *
 * A pour-over is four or five pours and somebody is watching a countdown that
 * resets at each one. Without this the only answer to "am I nearly done" was a
 * line of small text, and reading it means looking away from the number the
 * whole screen exists for.
 *
 * The step being poured is drawn in the primary colour and the ones behind it
 * in outline, so the shape says both how far in and which one is live - the
 * same bar filled uniformly would answer only the first.
 */
export const BrewStepProgress = ({ stepNumber, total }: BrewStepProgressProps): JSX.Element => {
  const styles = useThemedStyles(createBrewStepProgressStyles);
  const { t } = useTranslation();

  return (
    <View
      style={styles.track}
      accessibilityRole="progressbar"
      accessibilityLabel={t(TRANSLATION_KEYS.brewModeStepProgressLabel)}
      accessibilityValue={{ min: NONE, max: total, now: stepNumber }}
    >
      {Array.from({ length: total }, (_unused: unknown, index: number): JSX.Element => {
        const isDone = index < stepNumber - PREVIOUS;
        const isCurrent = index === stepNumber - PREVIOUS;

        return (
          <View
            key={`${KEY_PREFIX}${String(index)}`}
            style={[
              styles.segment,
              isCurrent ? styles.current : isDone ? styles.done : styles.todo,
              segmentWidth(),
            ]}
          />
        );
      })}
    </View>
  );
};
