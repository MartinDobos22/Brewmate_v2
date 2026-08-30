import type { BrewMethod, Recipe } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatGrams, formatRatio } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';
import { useBrewMethodCatalog } from '../../../inventory/hooks';

import { createRecipeChatHeaderStyles } from './RecipeChatHeader.styles';

export interface RecipeChatHeaderProps {
  /** The version that currently applies - the child, once a patch was taken. */
  readonly recipe: Recipe;
}

/**
 * What this conversation is about, and what the numbers are right now.
 *
 * The screen used to open straight onto chat bubbles. Halfway through arguing
 * about grind, the dose being argued over was not on the screen at all, and
 * the only way to see it was to leave the conversation - which is exactly when
 * somebody stops describing their coffee and starts guessing.
 *
 * It follows the applied version rather than the one the chat started from, so
 * accepting a change is visible here immediately. A header that kept printing
 * the numbers somebody had just replaced would be worse than none.
 */
export const RecipeChatHeader = ({ recipe }: RecipeChatHeaderProps): JSX.Element => {
  const styles = useThemedStyles(createRecipeChatHeaderStyles);
  const { t } = useTranslation();
  const { methods } = useBrewMethodCatalog();
  const method = methods.find((item: BrewMethod): boolean => item.id === recipe.methodId);

  return (
    <Card variant="container">
      <Text variant="labelSmall" tone="muted">
        {t(TRANSLATION_KEYS.recipeChatAboutTitle)}
      </Text>
      <Text variant="titleMedium">
        {method?.nameSk ?? t(TRANSLATION_KEYS.recipeChatUnknownMethod)}
      </Text>
      <View style={styles.rows}>
        <View style={styles.row}>
          <Text variant="labelMedium" tone="muted">
            {t(TRANSLATION_KEYS.recipeDose)}
          </Text>
          <Text variant="numericSmall" numeric>
            {formatGrams(recipe.params.doseGrams)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text variant="labelMedium" tone="muted">
            {t(TRANSLATION_KEYS.recipeWater)}
          </Text>
          <Text variant="numericSmall" numeric>
            {formatGrams(recipe.params.waterGrams)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text variant="labelMedium" tone="muted">
            {t(TRANSLATION_KEYS.recipeRatio)}
          </Text>
          <Text variant="numericSmall" numeric>
            {formatRatio(recipe.params.ratio)}
          </Text>
        </View>
      </View>
      <Text variant="labelSmall" tone="muted">
        {t(TRANSLATION_KEYS.recipeChatAboutHint)}
      </Text>
    </Card>
  );
};
