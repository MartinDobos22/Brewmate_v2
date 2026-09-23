import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { View } from 'react-native';

import { FigureRow, PillButton, Text } from '../../../../components/ui';
import { useRecipeFigures } from '../../../../hooks';
import { ROUTES, buildBrewModeRoute, buildBrewRoute } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import { HOME_TILE_ICONS } from '../../constants';
import type { HomeSuggestion as Suggestion } from '../../hooks';

import { createHomeSuggestionStyles } from './HomeSuggestion.styles';
import { SuggestionSubject } from './SuggestionSubject';

export interface HomeSuggestionProps {
  readonly suggestion: Suggestion;
}

/**
 * What to brew this morning, and the three ways to start.
 *
 * The recipe is one this person already has rather than one written for the
 * occasion: the numbers are read off their own rows, so pressing "Uvariť"
 * opens brew mode directly and costs nothing. Where the coffee has never been
 * brewed there are no numbers to print and the button leads to the screen that
 * writes them instead - which is the honest version of the same offer.
 *
 * The two round buttons beside it are the doors that need no cupboard at all.
 * They sit here rather than further down the screen because they are what
 * somebody reaches for when the recommendation is not what they meant.
 */
export const HomeSuggestion = ({ suggestion }: HomeSuggestionProps): JSX.Element | null => {
  const styles = useThemedStyles(createHomeSuggestionStyles);
  const { t } = useTranslation();
  const router = useRouter();
  const { suggested, recipe, method } = suggestion;
  const figures = useRecipeFigures(recipe?.params ?? null);

  if (suggested === null) {
    return null;
  }

  return (
    <View style={styles.block}>
      <Text variant="eyebrowEspresso" tone="accent">
        {t(TRANSLATION_KEYS.homeSuggestionEyebrow)}
      </Text>
      <SuggestionSubject suggested={suggested} method={method} />
      {figures === null ? null : <FigureRow scale="hero" ground="espresso" figures={figures} />}
      <View style={styles.row}>
        <PillButton
          tone="cream"
          size="large"
          grows
          raised
          icon={HOME_TILE_ICONS.brew}
          label={t(
            recipe === null
              ? TRANSLATION_KEYS.homeSuggestionWrite
              : TRANSLATION_KEYS.homeSuggestionBrew,
          )}
          onPress={(): void => {
            router.push(
              recipe === null ? buildBrewRoute(suggested.bag.id) : buildBrewModeRoute(recipe.id),
            );
          }}
        />
        <PillButton
          tone="lifted"
          size="large"
          icon={HOME_TILE_ICONS.quickBrew}
          spokenLabel={t(TRANSLATION_KEYS.homeTileQuickBrewTitle)}
          onPress={(): void => {
            router.push(ROUTES.quickBrew);
          }}
        />
        <PillButton
          tone="lifted"
          size="large"
          icon={HOME_TILE_ICONS.scan}
          spokenLabel={t(TRANSLATION_KEYS.homeTileScanTitle)}
          onPress={(): void => {
            router.push(ROUTES.scan);
          }}
        />
      </View>
    </View>
  );
};
