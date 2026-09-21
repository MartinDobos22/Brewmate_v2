import type { FlavorAffinities } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Chip, type ChipTone, type TileGlyph } from '../../../../components/ui';
import { useTranslation } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
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
const readIcon = (tag: string): TileGlyph | undefined =>
  isKnownTag(tag) ? FLAVOR_TAG_ICONS[tag] : undefined;

/**
 * Liked ones sit on the fresh ground and the rest on the card surface, which
 * is the whole difference between them: a tag somebody dislikes is as much a
 * fact about them as one they love, so it is present and quiet rather than
 * absent or marked as wrong.
 */
const LIKED_TONE: ChipTone = 'fresh';
const DISLIKED_TONE: ChipTone = 'lifted';

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
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      {rankFlavorAffinities(affinities).map(
        ({ tag, affinity }: FlavorAffinityEntry): JSX.Element => {
          const labelKey = resolveFlavorLabelKey(tag);

          return (
            <Chip
              key={tag}
              label={labelKey === null ? tag : t(labelKey)}
              icon={readIcon(tag)}
              tone={affinity > NEUTRAL ? LIKED_TONE : DISLIKED_TONE}
            />
          );
        },
      )}
    </View>
  );
};
