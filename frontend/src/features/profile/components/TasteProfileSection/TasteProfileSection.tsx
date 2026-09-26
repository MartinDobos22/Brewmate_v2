import type { JSX } from 'react';

import { QueryState } from '../../../../components/ui';
import {
  ConfidenceBoost,
  FlavorAffinityChips,
  TasteReading,
} from '../../../tasteProfile/components';
import { useTasteProfile } from '../../../tasteProfile/hooks';

import { TastePreferenceRows } from './TastePreferenceRows';

/**
 * What Brewmate believes about this person's taste, said in words.
 *
 * The web itself lives in the header, where it is the screen's headline. This
 * is what somebody reads when the shape is not enough: one row per axis, each
 * carrying the same mark its vertex does, and the flavours underneath.
 *
 * What would raise the confidence comes first and only while it is still low.
 * A confidence figure with no way to move it is a score, and nobody asked to
 * be scored - the design's own profile is past that point, which is why the
 * mock does not show it.
 *
 * Reporting only otherwise. The two ways of correcting it are the card below,
 * because a card that ended in two buttons under a second heading of its own
 * was a card asking to be two cards.
 */
export const TasteProfileSection = (): JSX.Element => {
  const { data: profile, isPending, isError, error, refetch } = useTasteProfile();

  if (isPending || isError) {
    return (
      <QueryState
        isPending={isPending}
        isError={isError}
        error={error}
        onRetry={(): void => {
          void refetch();
        }}
      />
    );
  }

  return (
    <>
      <ConfidenceBoost profile={profile} />
      <TasteReading axes={profile} axisConfidence={profile.axisConfidence} />
      <TastePreferenceRows profile={profile} />
      <FlavorAffinityChips affinities={profile.flavorAffinities} />
    </>
  );
};
