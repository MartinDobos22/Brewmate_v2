import type { ConstraintHint, Recipe } from '@brewmate/shared';
import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Button, Text } from '../../../../components/ui';
import { buildBrewModeRoute, buildRecipeChatRoute } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { RecipeSummaryCard } from '../../../brewing/components';
import type { RecipeImport } from '../../hooks';
import { ConversionReportCard } from '../ConversionReportCard';

import { createImportRecipeScreenStyles } from './ImportRecipeScreen.styles';

export interface ImportResultStepProps {
  readonly recipeImport: RecipeImport;
}

/**
 * The converted recipe, with the report about it directly underneath.
 *
 * Underneath rather than behind a tab, because the two belong together: the
 * numbers above are only trustworthy to the extent the card below says they
 * are, and a person who reads one without the other has been told a converted
 * grind is a measurement.
 *
 * The notes on the card are this recipe's own constraint hints rather than the
 * generic ones: a conversion made for somebody with no thermometer already
 * carries the procedure that replaces the temperature, and printing a second,
 * vaguer caveat beside it would bury the useful one.
 */
export const ImportResultStep = ({ recipeImport }: ImportResultStepProps): JSX.Element => {
  const styles = useThemedStyles(createImportRecipeScreenStyles);
  const { t } = useTranslation();
  const router = useRouter();
  const recipe: Recipe | null = recipeImport.recipe;
  const method = recipeImport.method;

  if (recipe === null || method === undefined) {
    return (
      <Text variant="bodyMedium" tone="muted">
        {t(TRANSLATION_KEYS.importConvertError)}
      </Text>
    );
  }

  const report = recipe.params.conversion;

  return (
    <View style={styles.result}>
      <RecipeSummaryCard
        title={t(TRANSLATION_KEYS.importResultTitle)}
        method={method}
        params={recipe.params}
        notes={(recipe.params.constraintHints ?? []).map(
          (hint: ConstraintHint): string => hint.hint,
        )}
      />
      {report === null || report === undefined ? null : <ConversionReportCard report={report} />}
      <Button
        label={t(TRANSLATION_KEYS.importResultBrew)}
        fullWidth
        onPress={(): void => {
          router.replace(buildBrewModeRoute(recipe.id));
        }}
      />
      <Button
        label={t(TRANSLATION_KEYS.importResultChat)}
        variant="secondary"
        fullWidth
        onPress={(): void => {
          router.push(buildRecipeChatRoute(recipe.id));
        }}
      />
    </View>
  );
};
