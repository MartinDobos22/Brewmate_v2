import type { BrewParams, CreateBrewLogRequest } from '@brewmate/shared';

const NO_CONSTRAINTS = {};

export interface BrewLogInput {
  readonly recipeId: string;
  readonly params: BrewParams;
  readonly equipmentSetId: string | null;
  readonly durationSeconds: number;
}

/**
 * What actually happened, as the API takes it.
 *
 * The constraints come off the recipe rather than being asked again: they were
 * declared on the screen before the brew and the recipe was shaped around
 * them, so asking a second time - with wet hands, over a finished cup - would
 * be asking somebody to confirm something they already told us. They are what
 * the API prices the learning weight from, which is why they have to travel
 * even though nobody re-typed them.
 *
 * `actualParams` records the recipe as it was followed. Brew mode has no way
 * to know that somebody poured 295 grams instead of 300, and inventing a
 * difference would be worse than recording none: what is stored is what the
 * recipe said, which is true unless somebody says otherwise in the chat.
 */
export const buildBrewLog = ({
  recipeId,
  params,
  equipmentSetId,
  durationSeconds,
}: BrewLogInput): CreateBrewLogRequest => ({
  recipeId,
  equipmentSetId,
  constraints: params.constraints ?? NO_CONSTRAINTS,
  waterType: params.waterType,
  durationSeconds: Math.round(durationSeconds),
  actualParams: {
    doseGrams: params.doseGrams,
    waterGrams: params.waterGrams,
    ratio: params.ratio,
    grindSetting: params.grindSetting,
    waterTempC: params.waterTempC,
  },
});
