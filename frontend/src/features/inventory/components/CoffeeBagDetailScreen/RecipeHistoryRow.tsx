import type { Recipe } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, FigureRow, Text } from '../../../../components/ui';
import { useRecipeFigures } from '../../../../hooks';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';

import { createCoffeeBagDetailStyles } from './CoffeeBagDetailScreen.styles';

export interface RecipeHistoryRowProps {
  readonly recipe: Recipe;
}

/**
 * One recipe, as the three numbers it is made of.
 *
 * The same row the home block leads with, the conversation's header sums up
 * and every version on the timeline prints - because a recipe is the same
 * three numbers wherever somebody meets it, and a screen that showed two of
 * them as a pair of label-and-value rows was inviting the reader to work out
 * for themselves that this is the thing they saw yesterday.
 *
 * The pinned one is drawn on a raised surface and says so in words. It is the
 * recipe this person settled on for these beans in this brewer, and finding
 * it again is the whole reason the history is kept - as one list row among
 * identical list rows it was distinguishable only by reading every subtitle.
 */
export const RecipeHistoryRow = ({ recipe }: RecipeHistoryRowProps): JSX.Element => {
  const styles = useThemedStyles(createCoffeeBagDetailStyles);
  const { t } = useTranslation();
  const figures = useRecipeFigures(recipe.params);

  return (
    <Card depth={recipe.isPinned ? 'emphasis' : 'rest'}>
      <View style={styles.recipeHead}>
        <Text variant="captionSmall" tone={recipe.isPinned ? 'secondary' : 'muted'}>
          {t(recipe.isPinned ? TRANSLATION_KEYS.bagRecipePinned : TRANSLATION_KEYS.bagRecipeSaved)}
        </Text>
      </View>
      {figures === null ? null : <FigureRow ruled={false} figures={figures} />}
    </Card>
  );
};
