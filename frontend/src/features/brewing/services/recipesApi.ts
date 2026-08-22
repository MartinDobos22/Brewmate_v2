import {
  API_ROUTES,
  buildApiPath,
  deletedResponseSchema,
  listResponseSchema,
  recipeSchema,
  type CreateRecipeRequest,
  type DeletedResponse,
  type ListResponse,
  type Recipe,
  type RecipeFilter,
  type UpdateRecipeRequest,
} from '@brewmate/shared';

import { HTTP_METHODS } from '../../../constants/http';
import { getApiClient, withQuery } from '../../../lib/apiClient';

const recipePath = (id: string): string => buildApiPath(API_ROUTES.recipeById, { id });

export const fetchRecipes = async (filter?: RecipeFilter): Promise<ListResponse<Recipe>> =>
  getApiClient().request({
    path: withQuery(API_ROUTES.recipes, filter),
    schema: listResponseSchema(recipeSchema),
  });

export const fetchRecipe = async (id: string): Promise<Recipe> =>
  getApiClient().request({ path: recipePath(id), schema: recipeSchema });

export const createRecipe = async (input: CreateRecipeRequest): Promise<Recipe> =>
  getApiClient().request({
    path: API_ROUTES.recipes,
    method: HTTP_METHODS.post,
    body: input,
    schema: recipeSchema,
  });

export const updateRecipe = async (id: string, changes: UpdateRecipeRequest): Promise<Recipe> =>
  getApiClient().request({
    path: recipePath(id),
    method: HTTP_METHODS.patch,
    body: changes,
    schema: recipeSchema,
  });

/** Refused with a 409 when a brew log already points at the recipe. */
export const deleteRecipe = async (id: string): Promise<DeletedResponse> =>
  getApiClient().request({
    path: recipePath(id),
    method: HTTP_METHODS.delete,
    schema: deletedResponseSchema,
  });
