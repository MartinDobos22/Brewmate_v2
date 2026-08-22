import type { FlavorAffinities } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text } from '../../../../components/ui';
import { useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import {
  rankFlavorAffinities,
  resolveFlavorLabelKey,
  type FlavorAffinityEntry,
} from '../../services';

import { createFlavorAffinityChipsStyles } from './FlavorAffinityChips.styles';

export interface FlavorAffinityChipsProps {
  readonly affinities: FlavorAffinities;
}

const NEUTRAL = 0;

/**
 * The flavours the profile has an opinion about.
 *
 * A tag Brewmate has never met is printed as it was stored, the way a coffee's
 * variety is: the vocabulary belongs to the world, so the interface shows what
 * it was given rather than hiding what it cannot translate.
 */
export const FlavorAffinityChips = ({ affinities }: FlavorAffinityChipsProps): JSX.Element => {
  const styles = useThemedStyles(createFlavorAffinityChipsStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      {rankFlavorAffinities(affinities).map(
        ({ tag, affinity }: FlavorAffinityEntry): JSX.Element => {
          const labelKey = resolveFlavorLabelKey(tag);
          const liked = affinity > NEUTRAL;

          return (
            <View key={tag} style={[styles.chip, liked ? styles.liked : styles.disliked]}>
              <Text variant="labelMedium" tone={liked ? 'secondary' : 'muted'}>
                {labelKey === null ? tag : t(labelKey)}
              </Text>
            </View>
          );
        },
      )}
    </View>
  );
};
