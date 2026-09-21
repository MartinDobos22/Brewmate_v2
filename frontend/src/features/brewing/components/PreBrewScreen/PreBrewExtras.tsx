import { BREW_METHOD_CATEGORIES, type Recipe } from '@brewmate/shared';
import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { View } from 'react-native';

import { PillButton } from '../../../../components/ui';
import { ROUTES, buildDialInRoute } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import type { BrewSetup } from '../../hooks/brewSetup';

import { createPreBrewScreenStyles } from './PreBrewScreen.styles';

export interface PreBrewExtrasProps {
  readonly setup: BrewSetup;
}

/**
 * The two ways out of this screen that are not "write me a recipe".
 *
 * Importing sits here rather than in a menu because this is where somebody is
 * already thinking about what to brew, and "mám recept z videa" is a thought
 * that arrives at exactly this moment.
 *
 * Dialling in appears only for a machine, and only because the choice really
 * is different there: a new bag on a lever is a sequence of shots aiming at a
 * time, not one recipe followed once. It still starts by asking the engine for
 * the same starting estimate - the dial-in is what happens after the first
 * shot, not a different way of writing the first one.
 */
export const PreBrewExtras = ({ setup }: PreBrewExtrasProps): JSX.Element => {
  const styles = useThemedStyles(createPreBrewScreenStyles);
  const { t } = useTranslation();
  const router = useRouter();
  const isEspresso = setup.method?.category === BREW_METHOD_CATEGORIES.espresso;

  return (
    <View style={styles.extras}>
      {isEspresso ? (
        <PillButton
          tone="surface"
          label={t(TRANSLATION_KEYS.preBrewStartDialIn)}
          fullWidth
          isPending={setup.isPending}
          disabled={setup.isPending}
          onPress={(): void => {
            setup.askForRecipe((recipe: Recipe): void => {
              router.replace(buildDialInRoute(recipe.id));
            });
          }}
        />
      ) : null}
      <PillButton
        tone="surface"
        label={t(TRANSLATION_KEYS.preBrewImportRecipe)}
        fullWidth
        onPress={(): void => {
          router.push(ROUTES.importRecipe);
        }}
      />
    </View>
  );
};
