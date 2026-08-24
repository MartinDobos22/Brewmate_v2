import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatDuration } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';

import { createBrewTimerDisplayStyles } from './BrewTimerDisplay.styles';

export interface BrewTimerDisplayProps {
  /** Seconds left in this step, or null where it ends on a sight. */
  readonly remainingSeconds: number | null;
  readonly elapsedSeconds: number;
}

/**
 * The one number that carries the screen.
 *
 * Set at a size no heading in the app uses, because for the length of a brew
 * this is the screen: read from half a metre away, by somebody whose hands are
 * wet and whose glasses are somewhere else. The elapsed time sits underneath
 * it in small type - useful afterwards, never the thing being watched.
 *
 * A step with no countdown says so in words instead of showing a zero. Zero
 * and "there is no number here" are different facts, and only one of them
 * means somebody is late.
 */
export const BrewTimerDisplay = ({
  remainingSeconds,
  elapsedSeconds,
}: BrewTimerDisplayProps): JSX.Element => {
  const styles = useThemedStyles(createBrewTimerDisplayStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      {remainingSeconds === null ? (
        <Text variant="headlineMedium" align="center">
          {t(TRANSLATION_KEYS.brewModeNoTimeStep)}
        </Text>
      ) : (
        <Text variant="numericDisplay" align="center" numeric>
          {formatDuration(Math.ceil(remainingSeconds))}
        </Text>
      )}
      <Text variant="bodyMedium" tone="muted" align="center" numeric>
        {t(TRANSLATION_KEYS.brewModeElapsed, {
          time: formatDuration(Math.floor(elapsedSeconds)),
        })}
      </Text>
    </View>
  );
};
