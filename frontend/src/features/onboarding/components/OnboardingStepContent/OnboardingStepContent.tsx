import type { ComponentType, JSX } from 'react';

import { ONBOARDING_STEPS, type OnboardingStep } from '../../constants/onboardingSteps';
import type { OnboardingFlow } from '../../hooks/useOnboardingFlow';
import { BrewersStep } from '../BrewersStep';
import { CalibrationStep } from '../CalibrationStep';
import { DoneStep } from '../DoneStep';
import { GearStep } from '../GearStep';
import { GrinderStep } from '../GrinderStep';
import { SetsStep } from '../SetsStep';
import { TasteStep } from '../TasteStep';
import { WaterStep } from '../WaterStep';
import { WelcomeStep } from '../WelcomeStep';

export interface OnboardingStepContentProps {
  readonly step: OnboardingStep;
  readonly flow: OnboardingFlow;
}

interface StepProps {
  readonly flow: OnboardingFlow;
}

/**
 * Which screen belongs to which step.
 *
 * A map rather than a switch, so adding a step is one entry here and one in
 * `ONBOARDING_STEPS` - and so the compiler refuses a step nobody drew.
 */
const STEP_SCREENS: Record<OnboardingStep, ComponentType<StepProps>> = {
  [ONBOARDING_STEPS.welcome]: WelcomeStep,
  [ONBOARDING_STEPS.taste]: TasteStep,
  [ONBOARDING_STEPS.grinder]: GrinderStep,
  [ONBOARDING_STEPS.brewers]: BrewersStep,
  [ONBOARDING_STEPS.gear]: GearStep,
  [ONBOARDING_STEPS.water]: WaterStep,
  [ONBOARDING_STEPS.sets]: SetsStep,
  [ONBOARDING_STEPS.calibration]: CalibrationStep,
  [ONBOARDING_STEPS.done]: DoneStep,
};

export const OnboardingStepContent = ({ step, flow }: OnboardingStepContentProps): JSX.Element => {
  const StepScreen = STEP_SCREENS[step];

  return <StepScreen flow={flow} />;
};
