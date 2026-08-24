import type { BrewMethod, Recipe } from '@brewmate/shared';
import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Button, EmptyState, Text } from '../../../../components/ui';
import { buildTimelineRoute } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { useBrewMethodCatalog } from '../../hooks';
import { groupRecipesByMethod, type RecipeMethodGroup } from '../../services/groupRecipesByMethod';

import { createCoffeeBagDetailStyles } from './CoffeeBagDetailScreen.styles';
import { RecipeHistoryRow } from './RecipeHistoryRow';

const NOTHING = 0;

export interface BagRecipeHistoryProps {
  readonly recipes: readonly Recipe[];
  /** Needed to open one method's line; a bag's own screen always knows it. */
  readonly bagId: string;
}

/**
 * Everything ever brewed from this bag, split by the way it was brewed.
 *
 * Split rather than listed flat because a recipe belongs to the pair (bag,
 * method): the same beans want a different dose in a V60 than in an AeroPress,
 * and one long list would invite somebody to read one method's numbers as an
 * improvement on another's.
 */
export const BagRecipeHistory = ({ recipes, bagId }: BagRecipeHistoryProps): JSX.Element => {
  const styles = useThemedStyles(createCoffeeBagDetailStyles);
  const { t } = useTranslation();
  const router = useRouter();
  const { methods } = useBrewMethodCatalog();

  if (recipes.length === NOTHING) {
    return (
      <EmptyState
        title={t(TRANSLATION_KEYS.bagRecipesEmptyTitle)}
        description={t(TRANSLATION_KEYS.bagRecipesEmptyBody)}
      />
    );
  }

  const nameFor = (methodId: string): string =>
    methods.find((method: BrewMethod): boolean => method.id === methodId)?.nameSk ??
    t(TRANSLATION_KEYS.bagRecipesUnknownMethod);

  return (
    <View>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.bagRecipesTitle)}</Text>
      {groupRecipesByMethod(recipes).map((group: RecipeMethodGroup): JSX.Element => (
        <View key={group.methodId} style={styles.group}>
          <Text variant="labelMedium" tone="muted">
            {nameFor(group.methodId)}
          </Text>
          <View style={styles.recipes}>
            {group.recipes.map((recipe: Recipe): JSX.Element => (
              <RecipeHistoryRow key={recipe.id} recipe={recipe} />
            ))}
            {/*
              The way into this pair's own story. It sits under the versions
              rather than replacing them, because the list answers "what have I
              got" and the timeline answers "how did it get here" - two
              questions somebody asks on different days.
            */}
            <Button
              label={t(TRANSLATION_KEYS.historyTimelineOpenAction)}
              variant="tertiary"
              onPress={(): void => {
                router.push(buildTimelineRoute(group.methodId, bagId));
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
};
