import { WATER_TYPES, type BrewParams, type WaterType } from '@brewmate/shared';

import {
  PROMPT_BULLET,
  PROMPT_LABEL_SEPARATOR,
  PROMPT_LINE_SEPARATOR,
} from '../constants/promptFormatting.js';

const EMPTY = '';

const line = (label: string, value: string): string =>
  [PROMPT_BULLET, label, PROMPT_LABEL_SEPARATOR, value].join(EMPTY);

/**
 * What the water will do to the cup, so the model can argue about it.
 *
 * A total map rather than a lookup with a fallback: adding a water type to the
 * contract should be a type error here, not a brew silently described to the
 * model as water nobody said anything about.
 */
const WATER_MEANINGS: Record<WaterType, string> = {
  [WATER_TYPES.tap]: 'straight from the tap, so its hardness is whatever the town supplies',
  [WATER_TYPES.bottled]: 'bottled, so its mineral content is whatever the label says',
  [WATER_TYPES.filtered]: 'through a domestic filter, so moderately soft and fairly predictable',
  [WATER_TYPES.remineralized]:
    'remineralised for brewing, so its mineral content is deliberate rather than inherited',
  [WATER_TYPES.unknown]: 'unknown - do not reason about its mineral content, only about symptoms',
};

/** The water, and what it can do to a cup, as one line for any prompt. */
export const describeWater = (waterType: WaterType): string =>
  line('Water they are using', WATER_MEANINGS[waterType]);

export interface ChosenAmounts {
  readonly doseGrams: number;
  readonly waterGrams: number;
  readonly ratio: number;
  readonly waterType: WaterType;
}

/**
 * The numbers this person already decided, stated as decisions.
 *
 * The wording matters more than the numbers do. "They have chosen" and "you
 * cannot change these" is what stops a helpful model from rounding a dose to
 * something tidier and handing back a recipe for a cup nobody asked for. The
 * schema makes it impossible anyway; this makes it obvious, which is what
 * keeps the rationale honest about the disagreement instead of silent.
 */
export const describeChosenAmounts = ({
  doseGrams,
  waterGrams,
  ratio,
  waterType,
}: ChosenAmounts): string =>
  [
    'What this person has already chosen for this brew. These are fixed - you cannot change them, and there is no field in your answer to put them in. If you think any of them is a mistake, say so once in the rationale and write the best recipe you can for these numbers:',
    line('Dose of dry coffee', `${String(doseGrams)} g`),
    line('Water (for an espresso, the yield in the cup)', `${String(waterGrams)} g`),
    line('Ratio', `1:${String(ratio)}`),
    describeWater(waterType),
  ].join(PROMPT_LINE_SEPARATOR);

const NO_TEMPERATURE = 'no target temperature';
const NO_TIME = 'no stated total time';
const NO_GRIND = 'no grind recorded';

/** One earlier recipe, reduced to what changed and why. */
export const describeParams = (params: BrewParams): string =>
  [
    `${String(params.doseGrams)} g to ${String(params.waterGrams)} g (1:${String(params.ratio)})`,
    params.waterTempC === null ? NO_TEMPERATURE : `${String(params.waterTempC)} °C`,
    params.grindLabel ?? (params.grindSetting === null ? NO_GRIND : String(params.grindSetting)),
    params.totalTimeSeconds === null || params.totalTimeSeconds === undefined
      ? NO_TIME
      : `${String(params.totalTimeSeconds)} s in total`,
  ].join(', ');
