import {
  API_ROUTES,
  recipeTimelineSchema,
  type RecipeTimeline,
  type RecipeTimelineQuery,
} from '@brewmate/shared';

import { getApiClient, withQuery } from '../../../lib/apiClient';

/**
 * One recipe line, read whole.
 *
 * Not paged, because what this screen exists to show is the shape of the line:
 * a dose that crept up over four versions is invisible if the fourth arrives
 * on its own. The API caps it instead, and says in each entry how many notes
 * and cups really exist behind the ones it sent.
 */
export const fetchRecipeTimeline = async (query: RecipeTimelineQuery): Promise<RecipeTimeline> =>
  getApiClient().request({
    path: withQuery(API_ROUTES.historyTimeline, query),
    schema: recipeTimelineSchema,
  });
