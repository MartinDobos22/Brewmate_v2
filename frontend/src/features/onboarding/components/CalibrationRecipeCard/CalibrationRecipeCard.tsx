import type { BrewMethod, BrewParams } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, Text, ValueDisplay } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatGrams, formatRatio, formatTemperature } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';

import { createCalibrationRecipeCardStyles } from './CalibrationRecipeCard.styles';

export interface CalibrationRecipeCardProps {
  readonly method: BrewMethod;
  readonly params: BrewParams;
  readonly hasTemperatureControl: boolean;
  readonly hasScale: boolean;
}

/**
 * The proposed cup.
 *
 * The two notes underneath are the difference between a recipe somebody can
 * follow and one they abandon: without a kettle that holds a temperature, or
 * without a scale, the numbers above need translating into something the
 * kitchen can actually do.
 */
export const CalibrationRecipeCard = ({
  method,
  params,
  hasTemperatureControl,
  hasScale,
}: CalibrationRecipeCardProps): JSX.Element => {
  const styles = useThemedStyles(createCalibrationRecipeCardStyles);
  const { t } = useTranslation();

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.calibrationRecipeTitle)}</Text>
      <Text variant="bodyMedium" tone="muted">
        {method.nameSk}
      </Text>
      <View style={styles.values}>
        <ValueDisplay
          label={t(TRANSLATION_KEYS.calibrationDose)}
          value={formatGrams(params.doseGrams)}
          unit={t(TRANSLATION_KEYS.unitGrams)}
        />
        <ValueDisplay
          label={t(TRANSLATION_KEYS.calibrationWater)}
          value={formatGrams(params.waterGrams)}
          unit={t(TRANSLATION_KEYS.unitGrams)}
        />
        <ValueDisplay
          label={t(TRANSLATION_KEYS.calibrationRatio)}
          value={formatRatio(params.ratio)}
        />
        {params.waterTempC === null ? null : (
          <ValueDisplay
            label={t(TRANSLATION_KEYS.calibrationTemperature)}
            value={formatTemperature(params.waterTempC)}
            unit={t(TRANSLATION_KEYS.unitCelsius)}
          />
        )}
      </View>
      <View style={styles.notes}>
        <Text variant="bodySmall" tone="muted">
          {t(TRANSLATION_KEYS.calibrationGrindMedium)}
        </Text>
        {hasTemperatureControl ? null : (
          <Text variant="bodySmall" tone="tertiary">
            {t(TRANSLATION_KEYS.calibrationNoTemperatureNote)}
          </Text>
        )}
        {hasScale ? null : (
          <Text variant="bodySmall" tone="tertiary">
            {t(TRANSLATION_KEYS.calibrationNoScaleNote)}
          </Text>
        )}
      </View>
    </Card>
  );
};
