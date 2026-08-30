import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';

import { createAuthBrandMarkStyles } from './AuthBrandMark.styles';

/**
 * The app, saying what it is, on the first screen anybody sees.
 *
 * The signed-out screens carried no identity at all - a headline, a form and
 * two buttons, which is what every application on the phone looks like from
 * the outside. A person who has just installed something is entitled to see
 * that they opened the right thing.
 *
 * The mark is the ring motif the tiles are decorated with, drawn from tokens
 * rather than shipped as artwork: this screen is the one place where being
 * wrong in one of the two colour schemes would be the first impression.
 */
export const AuthBrandMark = (): JSX.Element => {
  const styles = useThemedStyles(createAuthBrandMarkStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <View style={styles.mark}>
        <View style={styles.ring} />
        <View style={styles.inner} />
      </View>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.appName)}</Text>
    </View>
  );
};
