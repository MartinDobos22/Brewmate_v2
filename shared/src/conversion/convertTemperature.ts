import type { ConversionNote } from './conversionNoteSchema.js';
import { CONVERSION_PRECISIONS } from './conversionPrecision.js';
import { CONVERSION_REASONS } from './conversionReasons.js';
import type { ConversionTarget } from './conversionTarget.js';
import { DEFAULT_WATER_TEMP_C } from './methodDefaults.js';
import type { SourceRecipe } from './sourceRecipeSchema.js';

const TEMPERATURE = 'temperature';

export interface ConvertedTemperature {
  readonly waterTempC: number | null;
  readonly notes: readonly ConversionNote[];
}

/**
 * The brewing temperature, or the honest absence of one.
 *
 * A temperature is the one number in a recipe that converts perfectly: 94 °C
 * is 94 °C in anybody's kettle. So where the source stated one and the person
 * can set one, it comes through untouched and is reported as exact - there is
 * nothing to estimate.
 *
 * Where they cannot set one, the recipe gets no number at all rather than a
 * number with an apology attached. What they get instead is a procedure, and
 * that procedure arrives through the constraint hint the recipe already knows
 * how to carry - the same mechanism, and the same wording rules, as every
 * other brew written without temperature control.
 */
export const convertTemperature = (
  recipe: SourceRecipe,
  target: ConversionTarget,
): ConvertedTemperature => {
  if (!target.hasTemperatureControl) {
    return {
      waterTempC: null,
      notes: [
        {
          field: TEMPERATURE,
          precision: CONVERSION_PRECISIONS.unknown,
          reason: CONVERSION_REASONS.noTemperatureControl,
        },
      ],
    };
  }

  if (recipe.waterTempC !== null) {
    return {
      waterTempC: recipe.waterTempC,
      notes: [
        {
          field: TEMPERATURE,
          precision: CONVERSION_PRECISIONS.exact,
          reason: CONVERSION_REASONS.keptFromSource,
        },
      ],
    };
  }

  return {
    waterTempC: DEFAULT_WATER_TEMP_C[target.methodCategory],
    notes: [
      {
        field: TEMPERATURE,
        precision: CONVERSION_PRECISIONS.unknown,
        reason: CONVERSION_REASONS.notStatedInSource,
      },
    ],
  };
};
