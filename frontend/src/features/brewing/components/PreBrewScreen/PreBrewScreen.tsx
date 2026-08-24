import type { Recipe } from '@brewmate/shared';
import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { Screen } from '../../../../components/layout';
import { Text } from '../../../../components/ui';
import { buildBrewModeRoute } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { EquipmentSetSwitcher } from '../../../inventory/components';
import { useBrewSetup } from '../../hooks/useBrewSetup';

import { PreBrewSections } from './PreBrewSections';
import { PreBrewSubmit } from './PreBrewSubmit';

/**
 * Everything that gets decided before a single token is spent.
 *
 * The order is the order somebody standing in a kitchen can answer in: where
 * they are, what coffee, what they are brewing it in, what is missing today,
 * what water, and how much of each. Only then is a recipe asked for - because
 * a recipe written before those answers is a recipe written for a kitchen
 * nobody is standing in.
 */
export const PreBrewScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const setup = useBrewSetup();

  return (
    <Screen scrollable>
      <Text variant="headlineSmall">{t(TRANSLATION_KEYS.preBrewTitle)}</Text>
      <Text variant="bodyMedium" tone="muted">
        {t(TRANSLATION_KEYS.preBrewIntro)}
      </Text>
      <EquipmentSetSwitcher />
      <PreBrewSections setup={setup} />
      <PreBrewSubmit
        setup={setup}
        onWritten={(recipe: Recipe): void => {
          router.replace(buildBrewModeRoute(recipe.id, setup.activeSet?.id));
        }}
      />
    </Screen>
  );
};
