import type { JSX } from 'react';

import { Button, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { CALIBRATION_STAGES } from '../../constants/calibrationRecipe';
import { ONBOARDING_STEPS } from '../../constants/onboardingSteps';
import { useCalibrationBrew } from '../../hooks/useCalibrationBrew';
import type { OnboardingFlow } from '../../hooks/useOnboardingFlow';
import { CalibrationChat } from '../CalibrationChat';
import { CalibrationRecipeCard } from '../CalibrationRecipeCard';
import { OnboardingStepLayout } from '../OnboardingStepLayout';

export interface CalibrationStepProps {
  readonly flow: OnboardingFlow;
}

/**
 * The optional last step: brew one known cup and say how it went.
 *
 * The screen opens by saying it is not a test. Somebody who thinks they are
 * being marked brews more carefully than they ever will again and describes
 * the result the way they think they should - which is the one outcome that
 * makes this step worthless.
 */
export const CalibrationStep = ({ flow }: CalibrationStepProps): JSX.Element => {
  const { t } = useTranslation();
  const calibration = useCalibrationBrew();
  const ready = calibration.method !== undefined && calibration.params !== undefined;

  return (
    <OnboardingStepLayout step={ONBOARDING_STEPS.calibration} flow={flow}>
      <Text variant="headlineSmall">{t(TRANSLATION_KEYS.calibrationTitle)}</Text>
      <Text variant="bodyMedium">{t(TRANSLATION_KEYS.calibrationIntro)}</Text>
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.calibrationWhy)}
      </Text>
      {ready ? null : (
        <Text variant="bodyMedium" tone="tertiary">
          {t(TRANSLATION_KEYS.calibrationNoEquipmentBody)}
        </Text>
      )}
      {calibration.method === undefined || calibration.params === undefined ? null : (
        <CalibrationRecipeCard
          method={calibration.method}
          params={calibration.params}
          hasTemperatureControl={calibration.hasTemperatureControl}
          hasScale={calibration.hasScale}
        />
      )}
      {ready && calibration.stage === CALIBRATION_STAGES.proposal ? (
        <Button
          label={t(TRANSLATION_KEYS.calibrationBrewedAction)}
          loading={calibration.isPending}
          fullWidth
          onPress={(): void => {
            calibration.start(t(TRANSLATION_KEYS.calibrationRationale));
          }}
        />
      ) : null}
      {calibration.stage === CALIBRATION_STAGES.describe ? (
        <CalibrationChat calibration={calibration} />
      ) : null}
      {calibration.stage === CALIBRATION_STAGES.saved ? (
        <Text variant="bodyMedium" tone="secondary">
          {t(TRANSLATION_KEYS.calibrationSavedBody)}
        </Text>
      ) : null}
      <Button
        label={t(
          calibration.stage === CALIBRATION_STAGES.saved
            ? TRANSLATION_KEYS.onboardingContinue
            : TRANSLATION_KEYS.calibrationSkip,
        )}
        variant={calibration.stage === CALIBRATION_STAGES.saved ? 'primary' : 'tertiary'}
        onPress={flow.goNext}
        fullWidth
      />
    </OnboardingStepLayout>
  );
};
