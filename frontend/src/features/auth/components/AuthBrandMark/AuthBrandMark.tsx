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
import { useThemedStyles } from '../../../../theme';
import { BRAND_BREATH } from '../../constants';

import { createAuthBrandMarkStyles } from './AuthBrandMark.styles';

const STILL = 1;
const FOREVER = -1;
const REVERSE = true;
const HALF_CYCLE = 2;

/**
 * The app, saying what it is, on the first screen anybody sees.
 *
 * The signed-out screens carried no identity at all - a headline, a form and
 * two buttons, which is what every application on a phone looks like from the
 * outside. Somebody who has just installed something is entitled to see that
 * they opened the right thing.
 *
 * The ring breathes, slowly enough that it is felt rather than watched. It is
 * the only animation in the app that runs with nothing happening, and it is
 * here because this is the one screen where nothing is happening: somebody is
 * typing an address, and the alternative is a dark rectangle that looks like
 * it has stopped responding. It stands still when the phone asks for less
 * motion.
 */
export const AuthBrandMark = (): JSX.Element => {
  const styles = useThemedStyles(createAuthBrandMarkStyles);
  const { t } = useTranslation();
  const isReducedMotion = useReducedMotion();
  const breath = useSharedValue(STILL);

  useEffect((): void => {
    if (isReducedMotion) {
      breath.value = STILL;

      return;
    }

    breath.value = withRepeat(
      withTiming(BRAND_BREATH.scale, {
        duration: BRAND_BREATH.durationMs / HALF_CYCLE,
        easing: Easing.inOut(Easing.ease),
      }),
      FOREVER,
      REVERSE,
    );
  }, [isReducedMotion, breath]);

  const breathStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breath.value }],
  }));

  return (
    <View style={styles.wrapper}>
      <View style={styles.mark}>
        <Animated.View style={[styles.ring, breathStyle]} />
        <View style={styles.inner} />
      </View>
      <Text variant="displayIdentity" tone="onEspresso">
        {t(TRANSLATION_KEYS.appName)}
      </Text>
    </View>
  );
};
