import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { ROUTES, buildBrewModeRoute, buildBrewRoute } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatGrams, formatRatio } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';
import { HOME_TILE_ICONS } from '../../constants';
import type { HomeSuggestion as Suggestion } from '../../hooks';
import { HomeLeadAction, HomeRoundAction } from '../HomeActions';

import { createHomeSuggestionStyles } from './HomeSuggestion.styles';
import { SuggestionFigure } from './SuggestionFigure';
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

  if (suggested === null) {
    return null;
  }

  return (
    <View style={styles.block}>
      <Text variant="eyebrowEspresso" tone="accent">
        {t(TRANSLATION_KEYS.homeSuggestionEyebrow)}
      </Text>
      <SuggestionSubject suggested={suggested} method={method} />
      {recipe === null ? null : (
        <View style={styles.figures}>
          <SuggestionFigure
            value={formatGrams(recipe.params.doseGrams)}
            labelKey={TRANSLATION_KEYS.figureDose}
          />
          <View style={styles.rule} />
          <SuggestionFigure
            value={formatGrams(recipe.params.waterGrams)}
            labelKey={TRANSLATION_KEYS.figureWater}
          />
          <View style={styles.rule} />
          <SuggestionFigure
            value={formatRatio(recipe.params.ratio)}
            labelKey={TRANSLATION_KEYS.figureRatio}
            derived
          />
        </View>
      )}
      <View style={styles.row}>
        <HomeLeadAction
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
        <HomeRoundAction
          icon={HOME_TILE_ICONS.quickBrew}
          label={t(TRANSLATION_KEYS.homeTileQuickBrewTitle)}
          onPress={(): void => {
            router.push(ROUTES.quickBrew);
          }}
        />
        <HomeRoundAction
          icon={HOME_TILE_ICONS.scan}
          label={t(TRANSLATION_KEYS.homeTileScanTitle)}
          onPress={(): void => {
            router.push(ROUTES.scan);
          }}
        />
      </View>
    </View>
  );
};
