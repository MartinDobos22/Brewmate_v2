import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Button, Card, Text } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation, type TranslationKey } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { ConfidenceNotice } from '../../../tasteProfile/components';
import type { QuickBrew } from '../../hooks/useQuickBrew';
import { buildRecipeNoteKeys } from '../../services/buildRecipeNotes';
import { RecipeSummaryCard } from '../RecipeSummaryCard';

import { createQuickBrewRecipeStepStyles } from './QuickBrewRecipeStep.styles';

export interface QuickBrewRecipeStepProps {
  readonly brew: QuickBrew;
}

/**
 * The recipe, and the offer that comes after it rather than before it.
 *
 * The cupboard is proposed once the coffee has been brewed, when the person
 * knows whether the bag is worth writing down - not as a gate in front of the
 * recipe they came for.
 */
export const QuickBrewRecipeStep = ({ brew }: QuickBrewRecipeStepProps): JSX.Element | null => {
  const styles = useThemedStyles(createQuickBrewRecipeStepStyles);
  const { t } = useTranslation();
  const router = useRouter();

  if (brew.method === undefined || brew.params === undefined) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <RecipeSummaryCard
        title={t(TRANSLATION_KEYS.quickBrewRecipeTitle)}
        method={brew.method}
        params={brew.params}
        notes={buildRecipeNoteKeys({
          hasTemperatureControl: brew.hasTemperatureControl,
          hasScale: brew.hasScale,
        }).map((key: TranslationKey): string => t(key))}
      />
      <ConfidenceNotice />
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.quickBrewRecipeNoBagNote)}
      </Text>
      <Card>
        <View style={styles.offer}>
          <Text variant="titleMedium">{t(TRANSLATION_KEYS.quickBrewAddToInventoryTitle)}</Text>
          <Text variant="bodySmall" tone="muted">
            {t(TRANSLATION_KEYS.quickBrewAddToInventoryBody)}
          </Text>
          {brew.hasFailed ? (
            <Text variant="bodySmall" tone="error">
              {t(TRANSLATION_KEYS.quickBrewSaveError)}
            </Text>
          ) : null}
          <Button
            label={t(TRANSLATION_KEYS.quickBrewAddToInventoryAction)}
            fullWidth
            loading={brew.isPending}
            onPress={(): void => {
              brew.keepCoffee(t(TRANSLATION_KEYS.quickBrewUnnamedCoffee));
            }}
          />
          <Button
            label={t(TRANSLATION_KEYS.quickBrewAddToInventorySkip)}
            variant="tertiary"
            fullWidth
            onPress={(): void => {
              router.replace(ROUTES.home);
            }}
          />
        </View>
      </Card>
    </View>
  );
};
