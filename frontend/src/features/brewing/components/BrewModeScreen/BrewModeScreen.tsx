import { useLocalSearchParams } from 'expo-router';
import type { JSX } from 'react';

import { Screen, SCREEN_GROUNDS } from '../../../../components/layout';
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
 *
 * Dark in both colour schemes and padded by its own content rather than by the
 * screen: everything brew mode says has to be in one place for the length of a
 * brew, so it lays itself out against the full height instead of flowing down
 * a scroll somebody would have to chase with a wet hand.
 *
 * The ground follows the content rather than the route: there is no brew until
 * the recipe has arrived, so waiting for it and failing to get it are drawn as
 * the ordinary states they are. A dark skeleton is a screen of its own and is
 * not one of these two.
 */
export const BrewModeScreen = (): JSX.Element => {
  const params = useLocalSearchParams();
  const recipeId = readRouteParam(params[BREW_MODE_PARAMS.recipeId]);
  const equipmentSetId = readRouteParam(params[BREW_MODE_PARAMS.equipmentSetId]);
  const recipe = useRecipe(recipeId);

  return (
    <Screen
      ground={recipe.data === undefined ? SCREEN_GROUNDS.surface : SCREEN_GROUNDS.brew}
      padded={recipe.data === undefined}
    >
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
