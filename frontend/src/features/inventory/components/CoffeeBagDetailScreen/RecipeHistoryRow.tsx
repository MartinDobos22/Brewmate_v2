import type { Recipe } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatGrams, formatRatio } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';

import { createCoffeeBagDetailStyles } from './CoffeeBagDetailScreen.styles';

export interface RecipeHistoryRowProps {
  readonly recipe: Recipe;
}

/**
 * One recipe, as the two numbers somebody recognises it by.
 *
 * The pinned one is drawn on a raised surface and says so in words. It is the
 * recipe this person settled on for these beans in this brewer, and finding it
 * again is the whole reason the history is kept - as one list row among
 * identical list rows it was distinguishable only by reading every subtitle.
 */
export const RecipeHistoryRow = ({ recipe }: RecipeHistoryRowProps): JSX.Element => {
  const styles = useThemedStyles(createCoffeeBagDetailStyles);
  const { t } = useTranslation();
  const dose = `${formatGrams(recipe.params.doseGrams)} ${t(TRANSLATION_KEYS.unitGrams)}`;

  return (
    <Card variant={recipe.isPinned ? 'containerHigh' : 'outlined'}>
      <Text variant="labelSmall" tone={recipe.isPinned ? 'secondary' : 'muted'}>
        {t(recipe.isPinned ? TRANSLATION_KEYS.bagRecipePinned : TRANSLATION_KEYS.bagRecipeSaved)}
      </Text>
      <View style={styles.row}>
        <Text variant="labelMedium" tone="muted">
          {t(TRANSLATION_KEYS.bagRecipeDose)}
        </Text>
        <Text variant="numericSmall" numeric>
          {dose}
        </Text>
      </View>
      <View style={styles.row}>
        <Text variant="labelMedium" tone="muted">
          {t(TRANSLATION_KEYS.bagRecipeRatio)}
        </Text>
        <Text variant="numericSmall" numeric>
          {formatRatio(recipe.params.ratio)}
        </Text>
      </View>
    </Card>
  );
};
