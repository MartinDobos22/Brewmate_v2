import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { BrewMethod } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { BREW_METHOD_CATEGORY_ICONS } from '../../../brewing/constants';
import {
  BAG_FRESHNESS_ESPRESSO_TONES,
  BAG_FRESHNESS_LABEL_KEYS,
} from '../../../inventory/constants';
import type { SuggestedBag } from '../../services';

import { createHomeSuggestionStyles } from './HomeSuggestion.styles';

export interface SuggestionSubjectProps {
  readonly suggested: SuggestedBag;
  /** Absent where this coffee has never been brewed, which is an ordinary state. */
  readonly method: BrewMethod | null;
}

/**
 * Which coffee, in what, and what state it is in.
 *
 * The freshness is on this line rather than under the numbers because it is
 * the reason this bag was picked out of the cupboard at all. Read without it
 * the block is an app naming a coffee for no stated reason; read with it, it
 * is an app saying why this one and not the other two.
 */
export const SuggestionSubject = ({ suggested, method }: SuggestionSubjectProps): JSX.Element => {
  const styles = useThemedStyles(createHomeSuggestionStyles);
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.subject}>
      <Text variant="displayCompact" tone="onEspresso" numberOfLines={2}>
        {suggested.bag.name}
      </Text>
      <View style={styles.meta}>
        {method === null ? null : (
          <>
            <MaterialCommunityIcons
              name={BREW_METHOD_CATEGORY_ICONS[method.category]}
              size={theme.size.iconSmall}
              color={theme.colors.onEspressoVariant}
            />
            <Text variant="bodyMuted" tone="onEspressoMuted" numberOfLines={1}>
              {method.nameSk}
            </Text>
            <View style={styles.dot} />
          </>
        )}
        <Text variant="bodyMuted" tone={BAG_FRESHNESS_ESPRESSO_TONES[suggested.freshness]}>
          {t(BAG_FRESHNESS_LABEL_KEYS[suggested.freshness])}
        </Text>
      </View>
    </View>
  );
};
