import type { BrewParams, RecipePatch } from '@brewmate/shared';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';
import {
  formatDuration,
  formatGrams,
  formatRatio,
  formatTemperature,
} from '../../../lib/formatters';

const NOT_SET = '—';

export interface RecipePatchRow {
  readonly labelKey: TranslationKey;
  readonly before: string;
  readonly after: string;
}

const grams = (value: number | null | undefined): string =>
  value === null || value === undefined ? NOT_SET : formatGrams(value);

const seconds = (value: number | null | undefined): string =>
  value === null || value === undefined ? NOT_SET : formatDuration(value);

const text = (value: string | null | undefined): string => value ?? NOT_SET;

const number = (value: number | null | undefined): string =>
  value === null || value === undefined ? NOT_SET : String(value);

/**
 * The proposal, as a list of things that change.
 *
 * Only the fields the patch mentions appear, which is what makes it readable
 * as a diff rather than as a second recipe: everything on this list moved, and
 * anything not on it did not. A row that showed an unchanged value next to
 * itself would make somebody check every line to find the two that matter.
 *
 * The steps are the one exception, reported as "prepísaný" rather than as a
 * before and after. A pour schedule does not fit on a card next to another
 * pour schedule, and the number that decides whether to accept it - what
 * changes about the taste - is in the sentence above, not in the table.
 */
export const describeRecipePatch = (
  patch: RecipePatch,
  current: BrewParams,
): readonly RecipePatchRow[] => {
  const changed = patch.params;
  const rows: RecipePatchRow[] = [];

  if (changed.doseGrams !== undefined) {
    rows.push({
      labelKey: TRANSLATION_KEYS.recipePatchDose,
      before: grams(current.doseGrams),
      after: grams(changed.doseGrams),
    });
  }

  if (changed.waterGrams !== undefined) {
    rows.push({
      labelKey: TRANSLATION_KEYS.recipePatchWater,
      before: grams(current.waterGrams),
      after: grams(changed.waterGrams),
    });
  }

  if (changed.ratio !== undefined) {
    rows.push({
      labelKey: TRANSLATION_KEYS.recipePatchRatio,
      before: formatRatio(current.ratio),
      after: formatRatio(changed.ratio),
    });
  }

  if (changed.grindSetting !== undefined) {
    rows.push({
      labelKey: TRANSLATION_KEYS.recipePatchGrind,
      before: number(current.grindSetting),
      after: number(changed.grindSetting),
    });
  }

  if (changed.grindLabel !== undefined) {
    rows.push({
      labelKey: TRANSLATION_KEYS.recipePatchGrindLabel,
      before: text(current.grindLabel),
      after: text(changed.grindLabel),
    });
  }

  if (changed.waterTempC !== undefined) {
    rows.push({
      labelKey: TRANSLATION_KEYS.recipePatchTemperature,
      before: current.waterTempC === null ? NOT_SET : formatTemperature(current.waterTempC),
      after: changed.waterTempC === null ? NOT_SET : formatTemperature(changed.waterTempC),
    });
  }

  if (changed.totalTimeSeconds !== undefined) {
    rows.push({
      labelKey: TRANSLATION_KEYS.recipePatchTotalTime,
      before: seconds(current.totalTimeSeconds),
      after: seconds(changed.totalTimeSeconds),
    });
  }

  return rows;
};

/** Whether the patch rewrites the pour schedule, which no table can show. */
export const patchRewritesSteps = (patch: RecipePatch): boolean => patch.params.steps !== undefined;
