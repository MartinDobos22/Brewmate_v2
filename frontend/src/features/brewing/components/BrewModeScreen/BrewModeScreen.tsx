import { useLocalSearchParams } from 'expo-router';
import type { JSX } from 'react';

import { Screen, SCREEN_GROUNDS } from '../../../../components/layout';
import { QueryState } from '../../../../components/ui';
import { BREW_MODE_STATE_GROUND } from '../../constants';
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
 * The ground belongs to the route rather than to what has loaded. It used to
 * turn light while the recipe was on its way, so opening brew mode flashed a
 * white screen and then went black - on the one screen in the product held at
 * arm's length over a kettle. Waiting and failing are drawn on the espresso
 * ground instead, which is what `ground` on the state components is for.
 *
 * Only the padding still follows the content: a state is text that needs a
 * margin, and the run measures itself against the full height.
 */
export const BrewModeScreen = (): JSX.Element => {
  const params = useLocalSearchParams();
  const recipeId = readRouteParam(params[BREW_MODE_PARAMS.recipeId]);
  const equipmentSetId = readRouteParam(params[BREW_MODE_PARAMS.equipmentSetId]);
  const recipe = useRecipe(recipeId);

  return (
    <Screen ground={SCREEN_GROUNDS.brew} padded={recipe.data === undefined}>
      <QueryState
        isPending={recipe.isPending}
        isError={recipe.isError}
        error={recipe.error}
        onRetry={(): void => {
          void recipe.refetch();
        }}
        ground={BREW_MODE_STATE_GROUND}
      />
      {recipe.data === undefined ? null : (
        <BrewModeRun recipe={recipe.data} equipmentSetId={equipmentSetId} />
      )}
    </Screen>
  );
};
