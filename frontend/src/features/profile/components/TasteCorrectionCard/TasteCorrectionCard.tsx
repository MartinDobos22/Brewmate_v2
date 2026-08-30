import { useState, type JSX } from 'react';

import { Button, Card, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { ONBOARDING_STEPS } from '../../../onboarding/constants';
import { useOnboardingStepLink } from '../../../onboarding/hooks';
import { useTasteProfile } from '../../../tasteProfile/hooks';
import { TasteTuningSheet } from '../TasteTuningSheet';

/**
 * The two ways to disagree with the profile above, side by side.
 *
 * Answering the questionnaire again is evidence; moving the sliders is an
 * instruction. The second overrules the first, and should - which is what the
 * sentence on this card says out loud, because a person who cannot tell the
 * two apart will pick the wrong one and conclude the app ignored them.
 *
 * Its own card rather than a tail on the profile card: correcting a profile is
 * a different act from reading one, and it is the act somebody scrolls here
 * for.
 */
export const TasteCorrectionCard = (): JSX.Element | null => {
  const { t } = useTranslation();
  const { data: profile } = useTasteProfile();
  const openStep = useOnboardingStepLink();
  const [tuning, setTuning] = useState(false);

  if (profile === undefined) {
    return null;
  }

  return (
    <Card variant="container">
      <Text variant="titleMedium">{t(TRANSLATION_KEYS.profileTuneTitleCard)}</Text>
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.profileTuneCardBody)}
      </Text>
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
