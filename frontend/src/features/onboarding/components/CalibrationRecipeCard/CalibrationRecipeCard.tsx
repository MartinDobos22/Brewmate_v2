import type { BrewMethod, BrewParams } from '@brewmate/shared';
import type { JSX } from 'react';

import { TRANSLATION_KEYS, useTranslation, type TranslationKey } from '../../../../i18n';
import { RecipeSummaryCard } from '../../../brewing/components';
import { buildRecipeNoteKeys } from '../../../brewing/services';

export interface CalibrationRecipeCardProps {
  readonly method: BrewMethod;
  readonly params: BrewParams;
  readonly hasTemperatureControl: boolean;
  readonly hasScale: boolean;
}

/** The proposed reference cup, under the calibration step's own heading. */
export const CalibrationRecipeCard = ({
  method,
  params,
  hasTemperatureControl,
  hasScale,
}: CalibrationRecipeCardProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <RecipeSummaryCard
      title={t(TRANSLATION_KEYS.calibrationRecipeTitle)}
      method={method}
      params={params}
      notes={buildRecipeNoteKeys({ hasTemperatureControl, hasScale }).map(
        (key: TranslationKey): string => t(key),
      )}
    />
  );
};
