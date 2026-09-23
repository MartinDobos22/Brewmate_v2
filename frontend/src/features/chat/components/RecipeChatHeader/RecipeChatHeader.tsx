import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { BrewMethod, Recipe } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { EspressoHeader } from '../../../../components/layout';
import { FigureRow, Text } from '../../../../components/ui';
import { useRecipeFigures } from '../../../../hooks';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { BREW_METHOD_CATEGORY_ICONS } from '../../../brewing/constants';
import { useBrewMethodCatalog } from '../../../inventory/hooks';
import { CHAT_HEADER_ICONS } from '../../constants';

import { createRecipeChatHeaderStyles } from './RecipeChatHeader.styles';

export interface RecipeChatHeaderProps {
  /** The version that currently applies - the child, once a patch was taken. */
  readonly recipe: Recipe;
}

/**
 * What this conversation is about, and what the numbers are right now.
 *
 * It follows the applied version rather than the one the chat started from, so
 * accepting a change is visible here immediately. A header that kept printing
 * the numbers somebody had just replaced would be worse than none.
 *
 * The chip beside the brewer says which of the two this is, and says it in
 * words rather than as a count. A recipe carries a link to its parent and not
 * a depth, so "verzia 3" would be a number nothing in the row can prove -
 * whereas whether these numbers were written for this brew or arrived out of
 * this conversation is exactly what the link does say.
 */
export const RecipeChatHeader = ({ recipe }: RecipeChatHeaderProps): JSX.Element => {
  const styles = useThemedStyles(createRecipeChatHeaderStyles);
  const theme = useTheme();
  const { t } = useTranslation();
  const figures = useRecipeFigures(recipe.params);
  const { methods } = useBrewMethodCatalog();
  const method = methods.find((item: BrewMethod): boolean => item.id === recipe.methodId);

  return (
    <EspressoHeader>
      <View style={styles.method}>
        <MaterialCommunityIcons
          name={
            method === undefined
              ? CHAT_HEADER_ICONS.unknownMethod
              : BREW_METHOD_CATEGORY_ICONS[method.category]
          }
          size={theme.size.iconRow}
          color={theme.colors.accentOnEspresso}
        />
        <View style={styles.name}>
          <Text variant="rowTitle" tone="onEspresso" numberOfLines={1}>
            {method?.nameSk ?? t(TRANSLATION_KEYS.recipeChatUnknownMethod)}
          </Text>
        </View>
        <View style={styles.version}>
          <Text variant="eyebrow" tone="onEspressoMuted">
            {t(
              recipe.parentRecipeId === null
                ? TRANSLATION_KEYS.recipeChatVersionOriginal
                : TRANSLATION_KEYS.recipeChatVersionAdjusted,
            )}
          </Text>
        </View>
      </View>
      {figures === null ? null : <FigureRow scale="header" ground="espresso" figures={figures} />}
    </EspressoHeader>
  );
};
