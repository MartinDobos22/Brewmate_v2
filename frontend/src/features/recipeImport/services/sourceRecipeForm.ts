import type { SourceRecipe } from '@brewmate/shared';

const EMPTY = '';
const DECIMAL_COMMA = ',';
const DECIMAL_POINT = '.';

/**
 * A number somebody typed, or null for a box they left alone.
 *
 * A comma is a decimal point here: Slovak keyboards put one there, and a form
 * that silently drops "16,5" to nothing is one people stop trusting after the
 * first time it happens.
 */
const readNumber = (text: string): number | null => {
  const trimmed = text.trim().replace(DECIMAL_COMMA, DECIMAL_POINT);

  if (trimmed === EMPTY) {
    return null;
  }

  const value = Number(trimmed);

  return Number.isFinite(value) ? value : null;
};

const writeNumber = (value: number | null): string => (value === null ? EMPTY : String(value));

/**
 * The parsed recipe as a form somebody can correct.
 *
 * Strings rather than numbers throughout, because an empty box and a zero are
 * different answers and only one of them is a number. That distinction is the
 * whole point of this screen: what the source did not say has to stay unsaid
 * through the correction as well as through the reading.
 */
export interface SourceRecipeFormValues {
  readonly label: string;
  readonly doseGrams: string;
  readonly waterGrams: string;
  readonly ratio: string;
  readonly grindSetting: string;
  readonly grindLabel: string;
  readonly waterTempC: string;
  readonly totalTimeSeconds: string;
}

export const toSourceRecipeForm = (source: SourceRecipe): SourceRecipeFormValues => ({
  label: source.label ?? EMPTY,
  doseGrams: writeNumber(source.doseGrams),
  waterGrams: writeNumber(source.waterGrams),
  ratio: writeNumber(source.ratio),
  grindSetting: writeNumber(source.grindSetting),
  grindLabel: source.grindLabel ?? EMPTY,
  waterTempC: writeNumber(source.waterTempC),
  totalTimeSeconds: writeNumber(source.totalTimeSeconds),
});

/**
 * The corrections, folded back onto what was read.
 *
 * The parsed recipe is the base rather than being replaced, because the form
 * only covers the fields worth correcting by hand: the pour schedule, the
 * pre-infusion and the grinder the source named all survive untouched.
 */
export const toSourceRecipe = (
  values: SourceRecipeFormValues,
  base: SourceRecipe,
): SourceRecipe => ({
  ...base,
  label: values.label.trim() === EMPTY ? null : values.label.trim(),
  doseGrams: readNumber(values.doseGrams),
  waterGrams: readNumber(values.waterGrams),
  ratio: readNumber(values.ratio),
  grindSetting: readNumber(values.grindSetting),
  grindLabel: values.grindLabel.trim() === EMPTY ? null : values.grindLabel.trim(),
  waterTempC: readNumber(values.waterTempC),
  totalTimeSeconds:
    values.totalTimeSeconds.trim() === EMPTY
      ? null
      : Math.round(readNumber(values.totalTimeSeconds) ?? Number.NaN) || null,
});
