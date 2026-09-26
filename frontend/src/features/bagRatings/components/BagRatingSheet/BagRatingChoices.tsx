import type { BagImpression, BagRatingTag } from '@brewmate/shared';
import type { JSX } from 'react';
import { View } from 'react-native';

import { Chip, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation, type TranslationKey } from '../../../../i18n';
import { useThemedStyles } from '../../../../theme';
import {
  BAG_IMPRESSION_LABEL_KEYS,
  BAG_IMPRESSION_ORDER,
  BAG_RATING_DISLIKED_TAGS,
  BAG_RATING_LIKED_TAGS,
  BAG_RATING_TAG_LABEL_KEYS,
} from '../../constants';
import type { BagRatingDraft } from '../../hooks';

import { createBagRatingSheetStyles } from './BagRatingSheet.styles';

interface TagGroupProps {
  readonly titleKey: TranslationKey;
  readonly tags: readonly BagRatingTag[];
  readonly draft: BagRatingDraft;
}

const TagGroup = ({ titleKey, tags, draft }: TagGroupProps): JSX.Element => {
  const styles = useThemedStyles(createBagRatingSheetStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.group}>
      <Text variant="eyebrow" tone="muted">
        {t(titleKey)}
      </Text>
      <View style={styles.chips}>
        {tags.map((tag: BagRatingTag): JSX.Element => (
          <Chip
            key={tag}
            label={t(BAG_RATING_TAG_LABEL_KEYS[tag])}
            selected={draft.tags.includes(tag)}
            onPress={(): void => {
              draft.toggleTag(tag);
            }}
          />
        ))}
      </View>
    </View>
  );
};

/**
 * Everything under the stars, and all of it optional.
 *
 * The impression is one answer from five, because it is one statement about
 * the bag. The tags are as many as fit, in two groups, because "sweet and
 * chocolatey, but too heavy" is one ordinary sentence about a coffee.
 */
export const BagRatingChoices = ({ draft }: { readonly draft: BagRatingDraft }): JSX.Element => {
  const styles = useThemedStyles(createBagRatingSheetStyles);
  const { t } = useTranslation();

  return (
    <>
      <View style={styles.group}>
        <Text variant="eyebrow" tone="muted">
          {t(TRANSLATION_KEYS.bagRatingImpressionTitle)}
        </Text>
        <View style={styles.chips}>
          {BAG_IMPRESSION_ORDER.map((impression: BagImpression): JSX.Element => (
            <Chip
              key={impression}
              label={t(BAG_IMPRESSION_LABEL_KEYS[impression])}
              selected={draft.impression === impression}
              onPress={(): void => {
                draft.toggleImpression(impression);
              }}
            />
          ))}
        </View>
      </View>
      <TagGroup
        titleKey={TRANSLATION_KEYS.bagRatingLikedTitle}
        tags={BAG_RATING_LIKED_TAGS}
        draft={draft}
      />
      <TagGroup
        titleKey={TRANSLATION_KEYS.bagRatingDislikedTitle}
        tags={BAG_RATING_DISLIKED_TAGS}
        draft={draft}
      />
    </>
  );
};
