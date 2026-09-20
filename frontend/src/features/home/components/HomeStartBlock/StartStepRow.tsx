import type { JSX } from 'react';

import { ActionRow } from '../../../../components/ui';
import { useTranslation } from '../../../../i18n';
import {
  GETTING_STARTED_ICONS,
  GETTING_STARTED_LABEL_KEYS,
  GETTING_STARTED_NOTE_KEYS,
} from '../../constants';
import { useOpenGettingStartedStep } from '../../hooks';
import type { GettingStartedStep } from '../../services';

export interface StartStepRowProps {
  readonly step: GettingStartedStep;
}

/**
 * One step, and the flow behind it.
 *
 * Every row leads straight into the thing it names - a checklist that only
 * tells somebody what they ought to have done is an accusation, not help.
 */
export const StartStepRow = ({ step }: StartStepRowProps): JSX.Element => {
  const { t } = useTranslation();
  const open = useOpenGettingStartedStep();

  return (
    <ActionRow
      icon={GETTING_STARTED_ICONS[step.id]}
      title={t(GETTING_STARTED_LABEL_KEYS[step.id])}
      caption={t(GETTING_STARTED_NOTE_KEYS[step.id])}
      tone="espressoInset"
      onPress={(): void => {
        open(step.id);
      }}
    />
  );
};
