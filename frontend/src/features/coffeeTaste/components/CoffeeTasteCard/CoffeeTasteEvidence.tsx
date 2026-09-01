import type { CoffeeSignalSource } from '@brewmate/shared';
import type { JSX } from 'react';

import { Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { SIGNAL_LABEL_KEYS } from '../../constants/signalLabels';

const NOTHING = 0;
const LIST_SEPARATOR = ', ';

export interface CoffeeTasteEvidenceProps {
  readonly signals: readonly CoffeeSignalSource[];
  readonly isRefining: boolean;
}

/**
 * One line saying what the estimate is actually built on.
 *
 * The most important sentence on the card, and the one a chart cannot say. An
 * estimate drawn from a country and nothing else looks exactly like an
 * estimate drawn from a roast, a process, an altitude and four tasting notes
 * once both are five numbers on a shape - and they are worth completely
 * different amounts. Naming the evidence is what lets somebody disagree with
 * the answer rather than only believe or disbelieve it.
 */
export const CoffeeTasteEvidence = ({
  signals,
  isRefining,
}: CoffeeTasteEvidenceProps): JSX.Element => {
  const { t } = useTranslation();

  if (isRefining) {
    return (
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.coffeeTasteRefining)}
      </Text>
    );
  }

  if (signals.length === NOTHING) {
    return (
      <Text variant="bodySmall" tone="muted">
        {t(TRANSLATION_KEYS.coffeeTasteNoEvidence)}
      </Text>
    );
  }

  return (
    <Text variant="bodySmall" tone="muted">
      {t(TRANSLATION_KEYS.coffeeTasteEvidence, {
        signals: signals
          .map((signal: CoffeeSignalSource): string => t(SIGNAL_LABEL_KEYS[signal]))
          .join(LIST_SEPARATOR),
      })}
    </Text>
  );
};
