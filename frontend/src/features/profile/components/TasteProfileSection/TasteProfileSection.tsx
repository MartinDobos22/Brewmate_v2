import type { JSX } from 'react';

import { Card, QueryState, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import {
  ConfidenceBoost,
  ConfidenceIndicator,
  FlavorAffinityChips,
  TasteRadarChart,
  TasteReading,
} from '../../../tasteProfile/components';
import { useTasteProfile } from '../../../tasteProfile/hooks';

import { TastePreferenceRows } from './TastePreferenceRows';

/**
 * What Brewmate believes about this person's taste, and how much of it it has
 * actually earned.
 *
 * Reporting only. The two ways of correcting it are the card underneath,
 * because this one already carries four things - the chart, the two answers
 * that are a choice rather than a position, the flavours and the confidence -
 * and a card that ended in two buttons under a second heading of its own was a
 * card asking to be two cards.
 */
export const TasteProfileSection = (): JSX.Element => {
  const { t } = useTranslation();
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
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.profileTasteTitle)}</Text>
      <TasteRadarChart axes={profile} axisConfidence={profile.axisConfidence} />
      <TasteReading axes={profile} axisConfidence={profile.axisConfidence} />
      <TastePreferenceRows profile={profile} />
      <FlavorAffinityChips affinities={profile.flavorAffinities} />
      <ConfidenceIndicator profile={profile} />
      <ConfidenceBoost profile={profile} />
    </Card>
  );
};
