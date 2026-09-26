import type { BrewMethod, Equipment } from '@brewmate/shared';
import { useState, type JSX } from 'react';

import { InfoNote, PillButton, ScreenIntro } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { BrewMethodPicker, BrewerDetailsSheet } from '../../../inventory/components';
import { useBrewerSelection } from '../../../inventory/hooks';
import { ONBOARDING_STEPS } from '../../constants/onboardingSteps';
import type { OnboardingFlow } from '../../hooks/useOnboardingFlow';
import { OnboardingStepLayout } from '../OnboardingStepLayout';

export interface BrewersStepProps {
  readonly flow: OnboardingFlow;
}

const NOTHING = 0;

interface OpenDetails {
  readonly method: BrewMethod;
  readonly brewer: Equipment;
}

/**
 * What the user brews in.
 *
 * This is the step the rest of the app leans on: a method nothing in the
 * cupboard points at is never offered, so an empty answer here is honest
 * rather than damaging - it simply means Brewmate has nothing to suggest yet.
 */
export const BrewersStep = ({ flow }: BrewersStepProps): JSX.Element => {
  const { t } = useTranslation();
  const selection = useBrewerSelection();
  const [details, setDetails] = useState<OpenDetails | null>(null);

  return (
    <OnboardingStepLayout step={ONBOARDING_STEPS.brewers} flow={flow}>
      <ScreenIntro
        title={t(TRANSLATION_KEYS.setupBrewersTitle)}
        lead={t(TRANSLATION_KEYS.setupBrewersBody)}
      />
      <BrewMethodPicker
        selection={selection}
        onOpenDetails={(method: BrewMethod, brewer: Equipment): void => {
          setDetails({ method, brewer });
        }}
      />
      {selection.selectedCount === NOTHING ? (
        <InfoNote text={t(TRANSLATION_KEYS.setupBrewersEmptyNotice)} />
      ) : null}
      <PillButton
        tone="espresso"
        label={t(TRANSLATION_KEYS.onboardingContinue)}
        onPress={flow.goNext}
        fullWidth
      />
      {details === null ? null : (
        <BrewerDetailsSheet
          visible
          method={details.method}
          brewer={details.brewer}
          onClose={(): void => {
            setDetails(null);
          }}
        />
      )}
    </OnboardingStepLayout>
  );
};
