import { useRouter } from 'expo-router';
import type { JSX } from 'react';

import { ListItem, Text } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routes';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { ONBOARDING_STEPS } from '../../../onboarding/constants';
import { useOnboardingStepLink } from '../../../onboarding/hooks';
import {
  GETTING_STARTED_LABEL_KEYS,
  GETTING_STARTED_NOTE_KEYS,
  GETTING_STARTED_STEPS,
} from '../../constants/gettingStarted';
import type { GettingStartedStep } from '../../services/readGettingStartedSteps';

export interface GettingStartedStepItemProps {
  readonly step: GettingStartedStep;
  readonly showDivider: boolean;
}

/**
 * One step, and the flow behind it.
 *
 * Every row leads straight into the thing it names - a checklist that only
 * tells somebody what they ought to have done is an accusation, not help.
 */
export const GettingStartedStepItem = ({
  step,
  showDivider,
}: GettingStartedStepItemProps): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const openStep = useOnboardingStepLink();

  const open = (): void => {
    if (step.id === GETTING_STARTED_STEPS.taste) {
      openStep(ONBOARDING_STEPS.taste);

      return;
    }

    router.push(step.id === GETTING_STARTED_STEPS.coffee ? ROUTES.inventory : ROUTES.quickBrew);
  };

  return (
    <ListItem
      title={t(GETTING_STARTED_LABEL_KEYS[step.id])}
      subtitle={t(GETTING_STARTED_NOTE_KEYS[step.id])}
      showDivider={showDivider}
      onPress={open}
      trailing={
        step.isDone ? (
          <Text variant="labelMedium" tone="primary">
            {t(TRANSLATION_KEYS.homeStartStepDone)}
          </Text>
        ) : undefined
      }
    />
  );
};
