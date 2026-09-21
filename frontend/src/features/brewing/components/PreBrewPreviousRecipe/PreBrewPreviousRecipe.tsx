import type { BrewMethod, CoffeeBag, ConstraintHint } from '@brewmate/shared';
import { useRouter } from 'expo-router';
import type { JSX } from 'react';
import { View } from 'react-native';

import { PillButton } from '../../../../components/ui';
import { buildBrewModeRoute, buildTimelineRoute } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { formatDateTime } from '../../../../lib/formatters';
import { useThemedStyles } from '../../../../theme';
import { usePreviousBrew } from '../../hooks/usePreviousBrew';
import { RecipeSummaryCard } from '../RecipeSummaryCard';

import { createPreBrewPreviousRecipeStyles } from './PreBrewPreviousRecipe.styles';

const NO_CUPS = 0;

export interface PreBrewPreviousRecipeProps {
  readonly bag: CoffeeBag | null;
  readonly method: BrewMethod;
  readonly equipmentSetId: string | undefined;
}

/**
 * The recipe this person already has for this coffee in this brewer.
 *
 * Everything below it on the screen exists to write a new one, and for a pair
 * somebody has already dialled in that is the wrong thing to do twice over: it
 * pays a model to rediscover an answer sitting in their own rows, and it hands
 * back numbers slightly different from the ones they had settled on. The
 * version they pinned is the whole point of having dialled it in.
 *
 * So it sits directly under the brewer, above every question whose answer this
 * recipe already contains - a dose, a water weight, a grind. Reached after
 * scrolling past all of them it would be an offer made too late to save
 * anybody anything.
 *
 * It is drawn as the same card the import, the dial-in and the quick brew draw
 * a recipe with. A second way of printing four numbers would eventually differ
 * from the first by a unit or a rounding, and this is the screen where
 * somebody compares them.
 *
 * Nothing here is a default. Writing a new recipe is still the button at the
 * bottom of the screen, because the reason to be on this screen at all may be
 * that the last cup was wrong.
 */
export const PreBrewPreviousRecipe = ({
  bag,
  method,
  equipmentSetId,
}: PreBrewPreviousRecipeProps): JSX.Element | null => {
  const styles = useThemedStyles(createPreBrewPreviousRecipeStyles);
  const { t } = useTranslation();
  const router = useRouter();
  const previous = usePreviousBrew(bag, method);
  const recipe = previous.recipe;

  if (recipe === null) {
    return null;
  }

  /*
   * A recipe written and never brewed is a real state - somebody asked for one
   * yesterday and walked away - and it is still worth offering. It must not be
   * described as something they have made, though: "uvaril si ju takto" about a
   * cup that never happened is the app telling somebody about their own
   * morning and being wrong.
   */
  const history =
    previous.brewCount === NO_CUPS || previous.lastBrewedAt === null
      ? t(TRANSLATION_KEYS.preBrewPreviousNeverBrewed)
      : t(TRANSLATION_KEYS.preBrewPreviousBrewed, {
          count: previous.brewCount,
          date: formatDateTime(previous.lastBrewedAt),
        });

  return (
    <View style={styles.wrapper}>
      <RecipeSummaryCard
        title={t(
          previous.isPinned
            ? TRANSLATION_KEYS.preBrewPreviousPinnedTitle
            : TRANSLATION_KEYS.preBrewPreviousTitle,
        )}
        method={method}
        params={recipe.params}
        notes={[
          history,
          ...(recipe.params.constraintHints ?? []).map((hint: ConstraintHint): string => hint.hint),
        ]}
      />
      <View style={styles.actions}>
        <PillButton
          tone="espresso"
          label={t(TRANSLATION_KEYS.preBrewPreviousBrewAgain)}
          fullWidth
          onPress={(): void => {
            router.replace(buildBrewModeRoute(recipe.id, equipmentSetId));
          }}
        />
        <PillButton
          tone="surface"
          label={t(TRANSLATION_KEYS.preBrewPreviousTimeline)}
          fullWidth
          onPress={(): void => {
            router.push(buildTimelineRoute(method.id, bag?.id ?? null));
          }}
        />
      </View>
    </View>
  );
};
