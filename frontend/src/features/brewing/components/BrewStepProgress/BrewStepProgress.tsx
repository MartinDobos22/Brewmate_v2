import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
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
 * How much of the brew is left, as a glance rather than a number - with the
 * number beside it for the glance that was not enough.
 *
 * A pour-over is four or five pours and somebody is watching a countdown that
 * resets at each one. Without this the only answer to "am I nearly done" was a
 * line of small text, and reading it means looking away from the number the
 * whole screen exists for.
 */
export const BrewStepProgress = ({ stepNumber, total }: BrewStepProgressProps): JSX.Element => {
  const styles = useThemedStyles(createBrewStepProgressStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <View
        style={styles.track}
        accessibilityRole="progressbar"
        accessibilityLabel={t(TRANSLATION_KEYS.brewModeStepProgressLabel)}
        accessibilityValue={{ min: NONE, max: total, now: stepNumber }}
      >
        {Array.from({ length: total }, (_unused: unknown, index: number): JSX.Element => (
          <View
            key={`${KEY_PREFIX}${String(index)}`}
            style={[
              styles.segment,
              index <= stepNumber - PREVIOUS ? styles.reached : styles.todo,
              segmentWidth(),
            ]}
          />
        ))}
      </View>
      <Text variant="numericLabel" tone="onEspressoMuted" numeric>
        {t(TRANSLATION_KEYS.brewModeStepCount, { current: stepNumber, total })}
      </Text>
    </View>
  );
};
