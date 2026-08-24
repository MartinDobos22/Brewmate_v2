import type { JSX } from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation, type TranslationKey } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { BREW_RUN_STATES, type BrewRunState } from '../../constants';

import { createBrewControlsStyles } from './BrewControls.styles';

export interface BrewControlsProps {
  readonly state: BrewRunState;
  readonly isLastStep: boolean;
  readonly onStart: () => void;
  readonly onPause: () => void;
  readonly onResume: () => void;
  readonly onSkip: () => void;
  readonly onRestart: () => void;
}

/**
 * Three buttons, all of them enormous.
 *
 * Sized well past the smallest target any guideline allows, because the finger
 * pressing them is wet, in a hurry, and aiming at a phone leant against a
 * kettle. Nothing here is disabled either: a control that greys out is one
 * somebody presses twice before realising, and every one of these is
 * meaningful in every state the brew can be in.
 *
 * The primary control is the one in the middle and the biggest of the three,
 * so it can be hit without aiming.
 */
export const BrewControls = ({
  state,
  isLastStep,
  onStart,
  onPause,
  onResume,
  onSkip,
  onRestart,
}: BrewControlsProps): JSX.Element => {
  const styles = useThemedStyles(createBrewControlsStyles);
  const { t } = useTranslation();
  const isRunning = state === BREW_RUN_STATES.running;
  const hasStarted = state !== BREW_RUN_STATES.ready;

  const primaryLabel = ((): TranslationKey => {
    if (!hasStarted) {
      return TRANSLATION_KEYS.brewModeStart;
    }

    return isRunning ? TRANSLATION_KEYS.brewModePause : TRANSLATION_KEYS.brewModeResume;
  })();

  const onPrimary = (): void => {
    if (!hasStarted) {
      onStart();

      return;
    }

    if (isRunning) {
      onPause();

      return;
    }

    onResume();
  };

  return (
    <View style={styles.row}>
      <Pressable
        style={styles.secondary}
        onPress={onRestart}
        accessibilityRole="button"
        accessibilityLabel={t(TRANSLATION_KEYS.brewModeRestart)}
      >
        <Text variant="labelMedium" align="center">
          {t(TRANSLATION_KEYS.brewModeRestart)}
        </Text>
      </Pressable>
      <Pressable
        style={styles.primary}
        onPress={onPrimary}
        accessibilityRole="button"
        accessibilityLabel={t(primaryLabel)}
      >
        <Text variant="titleMedium" tone="onPrimary" align="center">
          {t(primaryLabel)}
        </Text>
      </Pressable>
      <Pressable
        style={styles.secondary}
        onPress={onSkip}
        accessibilityRole="button"
        accessibilityLabel={t(
          isLastStep ? TRANSLATION_KEYS.brewModeFinish : TRANSLATION_KEYS.brewModeSkip,
        )}
      >
        <Text variant="labelMedium" align="center">
          {t(isLastStep ? TRANSLATION_KEYS.brewModeFinish : TRANSLATION_KEYS.brewModeSkip)}
        </Text>
      </Pressable>
    </View>
  );
};
