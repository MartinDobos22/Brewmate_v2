import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { useTranslation, type TranslationKey } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';

import { createRecipeChatHeaderStyles } from './RecipeChatHeader.styles';

export interface RecipeChatFigureProps {
  readonly value: string;
  readonly labelKey: TranslationKey;
  /** The ratio, which is arithmetic over the two weights rather than one of them. */
  readonly derived?: boolean;
}

/**
 * One of the three numbers the header carries.
 *
 * The ratio is set smaller than the two weights on purpose: grams are the
 * physical fact somebody weighs out and the ratio is what divides them, so
 * printing all three at one size would invite the reader to treat the
 * arithmetic as a third thing to get right.
 */
export const RecipeChatFigure = ({
  value,
  labelKey,
  derived = false,
}: RecipeChatFigureProps): JSX.Element => {
  const styles = useThemedStyles(createRecipeChatHeaderStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.figure}>
      <Text variant={derived ? 'numericValue' : 'numericHeader'} tone="onEspresso" numeric>
        {value}
      </Text>
      <Text variant="eyebrow" tone="onEspressoMuted" numberOfLines={1}>
        {t(labelKey)}
      </Text>
    </View>
  );
};
