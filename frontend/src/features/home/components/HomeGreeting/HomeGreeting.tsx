import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { resolveGreetingKey } from '../../services';

import { createHomeGreetingStyles } from './HomeGreeting.styles';

/**
 * The line above the grid.
 *
 * The one thing on this screen that is about the moment rather than about the
 * account, and the reason the tiles below can go straight to reporting: a
 * screen that opens with a heading saying its own name is a screen that spends
 * its first line telling somebody where they already are.
 */
export const HomeGreeting = (): JSX.Element => {
  const styles = useThemedStyles(createHomeGreetingStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <Text variant="headlineSmall">{t(resolveGreetingKey())}</Text>
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.homeGreetingSubtitle)}
      </Text>
    </View>
  );
};
