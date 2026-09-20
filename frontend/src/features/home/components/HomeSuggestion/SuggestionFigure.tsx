import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { useTranslation, type TranslationKey } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';

import { createHomeSuggestionStyles } from './HomeSuggestion.styles';

export interface SuggestionFigureProps {
  readonly value: string;
  readonly labelKey: TranslationKey;
  /** The ratio, which is arithmetic over the two weights rather than one of them. */
  readonly derived?: boolean;
}

/** One of the three numbers the recommendation is made of. */
export const SuggestionFigure = ({
  value,
  labelKey,
  derived = false,
}: SuggestionFigureProps): JSX.Element => {
  const styles = useThemedStyles(createHomeSuggestionStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.figure}>
      <Text variant={derived ? 'numericLeadMinor' : 'numericLead'} tone="onEspresso" numeric>
        {value}
      </Text>
      <Text variant="eyebrow" tone="onEspressoMuted" numberOfLines={1}>
        {t(labelKey)}
      </Text>
    </View>
  );
};
