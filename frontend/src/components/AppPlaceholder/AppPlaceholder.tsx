import type { JSX } from 'react';
import { Text, View } from 'react-native';

import { TRANSLATION_KEYS, useTranslation } from '../../i18n';

import { appPlaceholderStyles } from './appPlaceholderStyles';

/** Empty shell. Product screens arrive once the API contract is in place. */
export const AppPlaceholder = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <View style={appPlaceholderStyles.screen}>
      <View style={appPlaceholderStyles.card}>
        <Text style={appPlaceholderStyles.title}>{t(TRANSLATION_KEYS.placeholderTitle)}</Text>
        <Text style={appPlaceholderStyles.body}>{t(TRANSLATION_KEYS.placeholderBody)}</Text>
      </View>
    </View>
  );
};
