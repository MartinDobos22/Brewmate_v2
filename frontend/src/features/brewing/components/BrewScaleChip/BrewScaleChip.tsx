import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, type JSX } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '../../../../components/ui';
import { useReducedMotion } from '../../../../hooks';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatGrams } from '../../../../lib/formatters';
import { useTheme, useThemedStyles } from '../../../../theme';
import { BREW_SCALE_CHIP } from '../../constants';

import { createBrewScaleChipStyles } from './BrewScaleChip.styles';

const STEADY = 1;
const FOREVER = -1;
const REVERSES = true;

export interface BrewScaleChipProps {
  /** Cumulative water that should be on the scale when this step ends. */
  readonly targetGrams: number;
  readonly isRunning: boolean;
}

/**
 * What the scale should read, inside the ring.
 *
 * On a dripper the whole of "what do I do now" is a number on a scale, so it
 * belongs in the same glance as the countdown rather than in a row underneath
 * it. The icon breathes while the weight is landing and holds still when the
 * brew is paused, which is the difference between a screen watching a pour and
 * one waiting for somebody to come back - stated by the one element that can
 * say it without a word.
 */
export const BrewScaleChip = ({ targetGrams, isRunning }: BrewScaleChipProps): JSX.Element => {
  const styles = useThemedStyles(createBrewScaleChipStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const isReducedMotion = useReducedMotion();
  const pulse = useSharedValue(STEADY);

  useEffect((): void => {
    if (!isRunning || isReducedMotion) {
      pulse.value = STEADY;

      return;
    }

    pulse.value = withRepeat(
      withTiming(BREW_SCALE_CHIP.pulseMinOpacity, {
        duration: BREW_SCALE_CHIP.pulseHalfCycleMs,
        easing: Easing.inOut(Easing.ease),
      }),
      FOREVER,
      REVERSES,
    );
  }, [isRunning, isReducedMotion, pulse]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <View style={styles.chip}>
      <Animated.View style={pulseStyle}>
        <MaterialCommunityIcons
          name={BREW_SCALE_CHIP.icon}
          size={BREW_SCALE_CHIP.iconSize}
          color={theme.colors.accentOnEspresso}
        />
      </Animated.View>
      <Text variant="numericValue" tone="onEspresso" numeric>
        {formatGrams(targetGrams)}
      </Text>
      <Text variant="unitLabel" tone="onEspressoMuted">
        {t(TRANSLATION_KEYS.brewModeScaleUnit)}
      </Text>
    </View>
  );
};
