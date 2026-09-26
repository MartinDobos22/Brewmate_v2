import type { BagImpression, BagRating, BagRatingTag } from '@brewmate/shared';
import { useState } from 'react';

const NO_TAGS: readonly BagRatingTag[] = [];

export interface BagRatingDraft {
  readonly stars: number | null;
  readonly impression: BagImpression | null;
  readonly tags: readonly BagRatingTag[];
  readonly chooseStars: (stars: number) => void;
  /** Choosing the impression already chosen clears it - it is optional. */
  readonly toggleImpression: (impression: BagImpression) => void;
  readonly toggleTag: (tag: BagRatingTag) => void;
}

/**
 * The rating being written, before it is saved.
 *
 * Starts from the one already given for this bag and stage, so changing your
 * mind is changing an answer rather than giving a second one from nothing.
 */
export const useBagRatingDraft = (existing: BagRating | null): BagRatingDraft => {
  const [stars, setStars] = useState<number | null>(existing?.stars ?? null);
  const [impression, setImpression] = useState<BagImpression | null>(existing?.impression ?? null);
  const [tags, setTags] = useState<readonly BagRatingTag[]>(existing?.tags ?? NO_TAGS);

  return {
    stars,
    impression,
    tags,
    chooseStars: setStars,
    toggleImpression: (chosen: BagImpression): void => {
      setImpression(impression === chosen ? null : chosen);
    },
    toggleTag: (tag: BagRatingTag): void => {
      setTags(
        tags.includes(tag)
          ? tags.filter((kept: BagRatingTag): boolean => kept !== tag)
          : [...tags, tag],
      );
    },
  };
};
