import { useLocalSearchParams } from 'expo-router';
import type { JSX } from 'react';

import { Screen } from '../../../../components/layout';
import { QueryState, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { BREW_MODE_PARAMS, readRouteParam } from '../../../brewing/components/BrewModeScreen';
import { useRecipe } from '../../../brewing/hooks';
import { useRecipeConversation } from '../../hooks';

import { RecipeChatBody } from './RecipeChatBody';
import { RECIPE_CHAT_PARAMS } from './recipeChatParams';

/**
 * The conversation about one recipe.
 *
 * Reached after a brew, and reachable from any recipe at any time - the second
 * is not an afterthought. Somebody who drank a cup an hour ago and only now
 * worked out what was wrong with it should be able to say so, and a chat that
 * only existed in the sixty seconds after a brew would miss most of what
 * people actually notice.
 */
export const RecipeChatScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const recipeId = readRouteParam(params[BREW_MODE_PARAMS.recipeId]);
  const brewLogId = readRouteParam(params[RECIPE_CHAT_PARAMS.brewLogId]);
  const recipe = useRecipe(recipeId);
  const conversation = useRecipeConversation(recipe.data, brewLogId);

  return (
    <Screen scrollable>
      <Text variant="headlineSmall">{t(TRANSLATION_KEYS.recipeChatTitle)}</Text>
      <QueryState
        isPending={recipe.isPending}
        isError={recipe.isError}
        error={recipe.error}
        onRetry={(): void => {
          void recipe.refetch();
        }}
      />
      {recipe.data === undefined ? null : (
        <RecipeChatBody recipe={recipe.data} conversation={conversation} />
      )}
    </Screen>
  );
};
