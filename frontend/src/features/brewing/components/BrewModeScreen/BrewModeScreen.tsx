import { useLocalSearchParams } from 'expo-router';
import type { JSX } from 'react';

import { Screen } from '../../../../components/layout';
import { QueryState } from '../../../../components/ui';
import { useRecipe } from '../../hooks/useRecipe';

import { BrewModeRun } from './BrewModeRun';
import { BREW_MODE_PARAMS, readRouteParam } from './brewModeParams';

/**
 * Brew mode, from the outside.
 *
 * The recipe is fetched rather than handed over in the route, so the screen
 * survives being reopened, deep-linked to, or restored after the app was
 * killed while the kettle boiled - all of which happen in a kitchen. The route
 * carries two ids and nothing that could go stale.
 */
export const BrewModeScreen = (): JSX.Element => {
  const params = useLocalSearchParams();
  const recipeId = readRouteParam(params[BREW_MODE_PARAMS.recipeId]);
  const equipmentSetId = readRouteParam(params[BREW_MODE_PARAMS.equipmentSetId]);
  const recipe = useRecipe(recipeId);

  return (
    <Screen scrollable>
      <QueryState
        isPending={recipe.isPending}
        isError={recipe.isError}
        error={recipe.error}
        onRetry={(): void => {
          void recipe.refetch();
        }}
      />
      {recipe.data === undefined ? null : (
        <BrewModeRun recipe={recipe.data} equipmentSetId={equipmentSetId} />
      )}
    </Screen>
  );
};
