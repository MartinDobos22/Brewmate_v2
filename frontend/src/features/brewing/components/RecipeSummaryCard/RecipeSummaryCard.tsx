import type { BrewMethod, BrewParams } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Card, Text, ValueDisplay } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatGrams, formatRatio, formatTemperature } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';

import { createRecipeSummaryCardStyles } from './RecipeSummaryCard.styles';

export interface RecipeSummaryCardProps {
  readonly title: string;
  readonly method: BrewMethod;
  readonly params: BrewParams;
  /** Lines that turn the numbers above into something a kitchen can do. */
  readonly notes: readonly string[];
}

/**
 * One recipe, as numbers somebody can follow.
 *
 * The notes underneath are the difference between a recipe that gets brewed
 * and one that gets abandoned: without a kettle that holds a temperature, or
 * without a scale, the figures above need translating.
 */
export const RecipeSummaryCard = ({
  title,
  method,
  params,
  notes,
}: RecipeSummaryCardProps): JSX.Element => {
  const styles = useThemedStyles(createRecipeSummaryCardStyles);
  const { t } = useTranslation();

  return (
    <Card>
      <Text variant="titleMedium">{title}</Text>
      <Text variant="bodyMedium" tone="muted">
        {method.nameSk}
      </Text>
      <View style={styles.values}>
        <ValueDisplay
          label={t(TRANSLATION_KEYS.recipeDose)}
          value={formatGrams(params.doseGrams)}
          unit={t(TRANSLATION_KEYS.unitGrams)}
        />
        <ValueDisplay
          label={t(TRANSLATION_KEYS.recipeWater)}
          value={formatGrams(params.waterGrams)}
          unit={t(TRANSLATION_KEYS.unitGrams)}
        />
        <ValueDisplay label={t(TRANSLATION_KEYS.recipeRatio)} value={formatRatio(params.ratio)} />
        {params.waterTempC === null ? null : (
          <ValueDisplay
            label={t(TRANSLATION_KEYS.recipeTemperature)}
            value={formatTemperature(params.waterTempC)}
            unit={t(TRANSLATION_KEYS.unitCelsius)}
          />
        )}
      </View>
      <View style={styles.notes}>
        {notes.map((note: string): JSX.Element => (
          <Text key={note} variant="bodySmall" tone="muted">
            {note}
          </Text>
        ))}
      </View>
    </Card>
  );
};
