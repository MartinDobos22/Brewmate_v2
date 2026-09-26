import type { Equipment } from '@brewmate/shared';
import type { JSX } from 'react';

import { Card, InfoNote, PillButton, ScreenIntro } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { EquipmentSetForm, EquipmentSetList } from '../../../inventory/components';
import { useEquipmentList } from '../../../inventory/hooks';
import { ONBOARDING_STEPS } from '../../constants/onboardingSteps';
import type { OnboardingFlow } from '../../hooks/useOnboardingFlow';
import { OnboardingStepLayout } from '../OnboardingStepLayout';

export interface SetsStepProps {
  readonly flow: OnboardingFlow;
}

const NONE: readonly Equipment[] = [];
const NOTHING = 0;

/**
 * Naming the places somebody brews in.
 *
 * A set introduces no equipment - it is a saved selection of what is already
 * in the cupboard - so the form is only offered once there is something to
 * combine, and says so plainly when there is not.
 */
export const SetsStep = ({ flow }: SetsStepProps): JSX.Element => {
  const { t } = useTranslation();
  const equipment = useEquipmentList();
  const owned = equipment.data?.items ?? NONE;

  return (
    <OnboardingStepLayout step={ONBOARDING_STEPS.sets} flow={flow}>
      <ScreenIntro
        title={t(TRANSLATION_KEYS.setupSetsTitle)}
        lead={t(TRANSLATION_KEYS.setupSetsBody)}
      />
      <Card>
        <EquipmentSetList />
      </Card>
      {owned.length === NOTHING ? (
        <InfoNote text={t(TRANSLATION_KEYS.setupSetsNothingToCombine)} />
      ) : (
        <EquipmentSetForm equipment={owned} />
      )}
      <PillButton
        tone="espresso"
        label={t(TRANSLATION_KEYS.onboardingContinue)}
        onPress={flow.goNext}
        fullWidth
      />
    </OnboardingStepLayout>
  );
};
