import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { FlavorAffinities } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Text, type TileGlyph } from '../../../../components/ui';
import { useTranslation } from '../../../../i18n';
import { useTheme, useThemedStyles } from '../../../../theme';
import { FLAVOR_TAGS, FLAVOR_TAG_ICONS, type FlavorTag } from '../../constants';
import {
  rankFlavorAffinities,
  resolveFlavorLabelKey,
  type FlavorAffinityEntry,
} from '../../services';

import { createFlavorAffinityChipsStyles } from './FlavorAffinityChips.styles';

const NEUTRAL = 0;

const isKnownTag = (tag: string): tag is FlavorTag =>
  Object.values(FLAVOR_TAGS).some((known: string): boolean => known === tag);

/** A tag the app has no word for gets no mark rather than a guessed one. */
const readIcon = (tag: string): TileGlyph | null =>
  isKnownTag(tag) ? FLAVOR_TAG_ICONS[tag] : null;

export interface FlavorAffinityChipsProps {
  readonly affinities: FlavorAffinities;
}

/**
 * The flavours the profile has an opinion about.
 *
 * A tag Brewmate has never met is printed as it was stored, the way a coffee's
 * variety is: the vocabulary belongs to the world, so the interface shows what
 * it was given rather than hiding what it cannot translate - and gives it no
 * mark rather than a guessed one.
 */
export const FlavorAffinityChips = ({ affinities }: FlavorAffinityChipsProps): JSX.Element => {
  const styles = useThemedStyles(createFlavorAffinityChipsStyles);
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      {rankFlavorAffinities(affinities).map(
        ({ tag, affinity }: FlavorAffinityEntry): JSX.Element => {
          const labelKey = resolveFlavorLabelKey(tag);
          const liked = affinity > NEUTRAL;
          const icon = readIcon(tag);

          return (
            <View key={tag} style={[styles.chip, liked ? styles.liked : styles.disliked]}>
              {icon === null ? null : (
                <MaterialCommunityIcons
                  name={icon}
                  size={theme.size.iconSmall}
                  color={liked ? theme.colors.onFreshContainer : theme.colors.onSurfaceVariant}
                />
              )}
              <Text variant="statusLabel" tone={liked ? 'default' : 'muted'}>
                {labelKey === null ? tag : t(labelKey)}
              </Text>
            </View>
          );
        },
      )}
    </View>
  );
};
