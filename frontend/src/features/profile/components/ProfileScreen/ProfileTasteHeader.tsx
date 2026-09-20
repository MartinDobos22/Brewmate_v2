import type { JSX } from 'react';

import { EspressoHeader } from '../../../../components/layout';
import { ConfidenceIndicator, TasteRadarChart } from '../../../tasteProfile/components';
import { useTasteProfile } from '../../../tasteProfile/hooks';
import { ProfileHeader } from '../ProfileHeader';

/**
 * Who this is, and what the app believes about them - in the one block the
 * screen leads with.
 *
 * The chart is the headline rather than a figure inside a card. Somebody opens
 * this screen to see their own taste, and as the third thing in a column it
 * arrived after two pieces of furniture.
 *
 * While the profile is loading the block holds the identity alone rather than
 * an empty chart. The slot is never empty, but it is also never filled with a
 * pentagon through five middles - five middles drawn neatly stop looking like
 * an absence of evidence and start looking like a considered opinion.
 */
export const ProfileTasteHeader = (): JSX.Element => {
  const { data: profile } = useTasteProfile();

  return (
    <EspressoHeader>
      <ProfileHeader />
      {profile === undefined ? null : (
        <>
          <TasteRadarChart
            ground="espresso"
            axes={profile}
            axisConfidence={profile.axisConfidence}
          />
          <ConfidenceIndicator profile={profile} />
        </>
      )}
    </EspressoHeader>
  );
};
