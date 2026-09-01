import type { JSX } from 'react';

import { Button, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { TasteRadarChart } from '../../../tasteProfile/components';
import { useTasteProfile } from '../../../tasteProfile/hooks';

export interface TasteSavedPanelProps {
  /** True when the questionnaire was opened on its own, rather than in the flow. */
  readonly isSingleStep: boolean;
  readonly onContinue: () => void;
}

/**
 * The end of the questionnaire, which used to be nothing at all.
 *
 * Tapping the last card sent the answers and slid straight on to the next
 * step, so the one moment the whole questionnaire exists for - the profile
 * actually being taught something - was the one moment nothing was said. Ten
 * questions answered and then the screen simply changed reads as an app that
 * lost them, which is exactly what somebody assumes when the home screen still
 * asks them to fill in the questionnaire afterwards.
 *
 * The profile is drawn rather than described, for the reason the closing
 * screen draws it too: the answers came back as a shape, and a shape with
 * vertices it has not earned yet is also the honest way of saying how much of
 * this is still a guess.
 */
export const TasteSavedPanel = ({
  isSingleStep,
  onContinue,
}: TasteSavedPanelProps): JSX.Element => {
  const { t } = useTranslation();
  const { data: profile } = useTasteProfile();

  return (
    <>
      <Text variant="headlineSmall">{t(TRANSLATION_KEYS.tqSavedTitle)}</Text>
      <Text variant="bodyMedium">{t(TRANSLATION_KEYS.tqSavedBody)}</Text>
      {profile === undefined ? null : (
        <TasteRadarChart axes={profile} axisConfidence={profile.axisConfidence} />
      )}
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.tqSavedHint)}
      </Text>
      <Button
        label={t(isSingleStep ? TRANSLATION_KEYS.actionDone : TRANSLATION_KEYS.onboardingContinue)}
        onPress={onContinue}
        fullWidth
      />
    </>
  );
};
