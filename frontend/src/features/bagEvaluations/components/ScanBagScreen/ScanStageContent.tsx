import type { JSX } from 'react';

import { EmptyState, QueryState, Text } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { BAG_SCAN_STAGES } from '../../constants/bagScan';
import type { BagScan } from '../../hooks/useBagScan';
import { BagLabelForm } from '../BagLabelForm';
import { BagVerdictCard } from '../BagVerdictCard';
import { ScanOutcomeStep } from '../ScanOutcomeStep';

export interface ScanStageContentProps {
  readonly scan: BagScan;
}

/** One stage of the shop flow at a time, chosen where the stage is named. */
export const ScanStageContent = ({ scan }: ScanStageContentProps): JSX.Element => {
  const { t } = useTranslation();

  if (scan.isLoading || scan.isError) {
    return (
      <QueryState
        isPending={scan.isLoading}
        isError={scan.isError}
        error={scan.error}
        onRetry={scan.retry}
      />
    );
  }

  if (scan.stage === BAG_SCAN_STAGES.label) {
    return (
      <>
        <Text variant="bodyMedium" tone="muted">
          {t(TRANSLATION_KEYS.scanIntro)}
        </Text>
        <BagLabelForm scan={scan} />
      </>
    );
  }

  if (scan.stage === BAG_SCAN_STAGES.verdict && scan.verdict !== null) {
    return (
      <>
        <BagVerdictCard verdict={scan.verdict} />
        <ScanOutcomeStep scan={scan} />
      </>
    );
  }

  return (
    <EmptyState
      title={t(
        scan.wasPurchased ? TRANSLATION_KEYS.scanSavedTitle : TRANSLATION_KEYS.scanSkippedTitle,
      )}
      description={t(
        scan.wasPurchased ? TRANSLATION_KEYS.scanSavedBody : TRANSLATION_KEYS.scanSkippedBody,
      )}
      actions={[{ label: t(TRANSLATION_KEYS.scanAgain), variant: 'primary', onPress: scan.reset }]}
    />
  );
};
