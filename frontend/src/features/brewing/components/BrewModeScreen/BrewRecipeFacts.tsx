import type { BrewParams } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text, ValueDisplay } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatDuration, formatGrams, formatTemperature } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';

import { createBrewModeScreenStyles } from './BrewModeScreen.styles';

export interface BrewRecipeFactsProps {
  readonly params: BrewParams;
}

/**
 * The numbers somebody reads while they weigh out, before the clock starts.
 *
 * On the espresso ground, because brew mode is dark in both colour schemes and
 * a value taking its tone from the active one would be invisible on half the
 * phones this runs on.
 *
 * The grind is printed in words as well as in collar numbers, because the
 * number is only an instruction to somebody whose grinder Brewmate has seen -
 * and the words are an instruction to everybody. Anything the recipe does not
 * state is left out rather than shown as a dash: a row saying "teplota -" only
 * tells somebody that the app has a temperature field.
 */
export const BrewRecipeFacts = ({ params }: BrewRecipeFactsProps): JSX.Element => {
  const styles = useThemedStyles(createBrewModeScreenStyles);
  const { t } = useTranslation();
  const preInfusion = params.espresso?.preInfusionSeconds ?? null;

  return (
    <View style={styles.facts}>
      <ValueDisplay
        ground="espresso"
        label={t(TRANSLATION_KEYS.brewModeDose)}
        value={formatGrams(params.doseGrams)}
        unit={t(TRANSLATION_KEYS.unitGrams)}
      />
      <ValueDisplay
        ground="espresso"
        label={t(TRANSLATION_KEYS.brewModeWater)}
        value={formatGrams(params.waterGrams)}
        unit={t(TRANSLATION_KEYS.unitGrams)}
      />
      {params.waterTempC === null ? null : (
        <ValueDisplay
          ground="espresso"
          label={t(TRANSLATION_KEYS.brewModeTemperature)}
          value={formatTemperature(params.waterTempC)}
          unit={t(TRANSLATION_KEYS.unitCelsius)}
        />
      )}
      {preInfusion === null ? null : (
        <ValueDisplay
          ground="espresso"
          label={t(TRANSLATION_KEYS.brewModePreInfusion)}
          value={formatDuration(preInfusion)}
        />
      )}
      {(params.grindLabel === null || params.grindLabel === undefined) &&
      params.grindSetting === null ? null : (
        <View style={styles.grind}>
          <Text variant="eyebrow" tone="onEspressoMuted">
            {t(TRANSLATION_KEYS.brewModeGrind)}
          </Text>
          <Text variant="bodyText" tone="onEspresso">
            {params.grindLabel ?? String(params.grindSetting)}
          </Text>
        </View>
      )}
    </View>
  );
};
