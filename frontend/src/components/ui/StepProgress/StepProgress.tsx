import type { JSX } from 'react';
import { View } from 'react-native';

import { TRANSLATION_KEYS, useTranslation } from '../../../i18n';
import { useThemedStyles } from '../../../theme';
import { Text } from '../Text';

import { createStepProgressStyles, segmentWidth } from './StepProgress.styles';

const NONE = 0;
const KEY_PREFIX = 'step-';

export interface StepProgressProps {
  /** Counting from one. Zero draws nothing - the flow is over. */
  readonly current: number;
  readonly total: number;
}

/**
 * How far through a short flow somebody is.
 *
 * Used by every flow in the app that changes the screen under somebody more
 * than twice - the scanner, the quick brew - because "how much more of this is
 * there" is a fair question in all of them, and each answering it its own way
 * would be three different answers to one question.
 *
 * It draws nothing at zero: a flow that has finished is showing what happened,
 * not a step left to get through.
 */
export const StepProgress = ({ current, total }: StepProgressProps): JSX.Element | null => {
  const styles = useThemedStyles(createStepProgressStyles);
  const { t } = useTranslation();

  if (current === NONE || total === NONE) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <Text variant="labelSmall" tone="muted">
        {t(TRANSLATION_KEYS.stepCount, { current, total })}
      </Text>
      <View
        style={styles.track}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: NONE, max: total, now: current }}
      >
        {Array.from({ length: total }, (_unused: unknown, index: number): JSX.Element => (
          <View
            key={`${KEY_PREFIX}${String(index)}`}
            style={[styles.segment, index < current ? styles.done : styles.todo, segmentWidth()]}
          />
        ))}
      </View>
    </View>
  );
};
