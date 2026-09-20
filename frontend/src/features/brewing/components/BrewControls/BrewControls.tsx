import type { ComponentProps, JSX } from 'react';
import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View } from 'react-native';

import { TRANSLATION_KEYS, useTranslation, type TranslationKey } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { BREW_CONTROL_ICONS, BREW_RUN_STATES, type BrewRunState } from '../../constants';

import { BrewControlButton } from './BrewControlButton';
import { createBrewControlsStyles } from './BrewControls.styles';

type GlyphName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export interface BrewControlsProps {
  readonly state: BrewRunState;
  readonly isLastStep: boolean;
  readonly onStart: () => void;
  readonly onPause: () => void;
  readonly onResume: () => void;
  readonly onSkip: () => void;
  readonly onRestart: () => void;
}

interface PrimaryControl {
  readonly labelKey: TranslationKey;
  readonly icon: GlyphName;
  readonly onPress: () => void;
}

/**
 * Restart, the one thing to press, and skip - in that order, always.
 *
 * The middle button changes what it does and never where it is. A control that
 * moved between states is one somebody has to look at before pressing, and
 * looking at the phone is the thing this screen is designed to let them stop
 * doing.
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

  const primary = ((): PrimaryControl => {
    if (state === BREW_RUN_STATES.ready) {
      return {
        labelKey: TRANSLATION_KEYS.brewModeStart,
        icon: BREW_CONTROL_ICONS.start,
        onPress: onStart,
      };
    }

    if (state === BREW_RUN_STATES.running) {
      return {
        labelKey: TRANSLATION_KEYS.brewModePause,
        icon: BREW_CONTROL_ICONS.pause,
        onPress: onPause,
      };
    }

    return {
      labelKey: TRANSLATION_KEYS.brewModeResume,
      icon: BREW_CONTROL_ICONS.resume,
      onPress: onResume,
    };
  })();

  const skipKey = isLastStep ? TRANSLATION_KEYS.brewModeFinish : TRANSLATION_KEYS.brewModeSkip;

  return (
    <View style={styles.row}>
      <BrewControlButton
        icon={BREW_CONTROL_ICONS.restart}
        label={t(TRANSLATION_KEYS.brewModeRestart)}
        onPress={onRestart}
      />
      <BrewControlButton
        icon={primary.icon}
        label={t(primary.labelKey)}
        isPrimary
        onPress={primary.onPress}
      />
      <BrewControlButton
        icon={isLastStep ? BREW_CONTROL_ICONS.finish : BREW_CONTROL_ICONS.skip}
        label={t(skipKey)}
        onPress={onSkip}
      />
    </View>
  );
};
