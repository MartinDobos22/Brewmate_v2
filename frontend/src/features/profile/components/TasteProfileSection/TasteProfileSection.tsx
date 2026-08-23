import { useState, type JSX } from 'react';

import { Button, Card, ErrorState, LoadingState, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { ONBOARDING_STEPS } from '../../../onboarding/constants';
import { useOnboardingStepLink } from '../../../onboarding/hooks';
import {
  ConfidenceIndicator,
  FlavorAffinityChips,
  TasteProfileChart,
} from '../../../tasteProfile/components';
import { useTasteProfile } from '../../../tasteProfile/hooks';
import { TasteTuningSheet } from '../TasteTuningSheet';

import { TastePreferenceRows } from './TastePreferenceRows';

/**
 * What Brewmate believes about this person's taste, and how much of it it has
 * actually earned.
 *
 * Both ways of changing it are offered side by side: answering the
 * questionnaire again, which is evidence, and moving the sliders, which is an
 * instruction. The second overrules the first, and should.
 */
export const TasteProfileSection = (): JSX.Element => {
  const { t } = useTranslation();
  const { data: profile, isPending, isError, refetch } = useTasteProfile();
  const openStep = useOnboardingStepLink();
  const [tuning, setTuning] = useState(false);

  if (isPending) {
    return <LoadingState label={t(TRANSLATION_KEYS.stateLoading)} />;
  }

  if (isError) {
    return (
      <ErrorState
        title={t(TRANSLATION_KEYS.stateErrorTitle)}
        description={t(TRANSLATION_KEYS.stateErrorBody)}
        retryLabel={t(TRANSLATION_KEYS.actionRetry)}
        onRetry={(): void => {
          void refetch();
        }}
      />
    );
  }

  return (
    <Card>
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.profileTasteTitle)}</Text>
      <TasteProfileChart axes={profile} />
      <TastePreferenceRows profile={profile} />
      <FlavorAffinityChips affinities={profile.flavorAffinities} />
      <ConfidenceIndicator profile={profile} />
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.profileRetakeTitle)}</Text>
      <Button
        label={t(TRANSLATION_KEYS.profileRetakeAction)}
        variant="secondary"
        fullWidth
        onPress={(): void => {
          openStep(ONBOARDING_STEPS.taste);
        }}
      />
      <Button
        label={t(TRANSLATION_KEYS.profileTuneAction)}
        variant="tertiary"
        fullWidth
        onPress={(): void => {
          setTuning(true);
        }}
      />
      <TasteTuningSheet
        visible={tuning}
        profile={profile}
        onClose={(): void => {
          setTuning(false);
        }}
      />
    </Card>
  );
};
