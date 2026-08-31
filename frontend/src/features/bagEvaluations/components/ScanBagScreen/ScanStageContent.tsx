import type { JSX } from 'react';

import { LoadingState } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { BAG_SCAN_STAGES } from '../../constants/bagScan';
import type { BagScan } from '../../hooks/useBagScan';
import { BagLabelForm } from '../BagLabelForm';
import { BagPhotoStep } from '../BagPhotoStep';
import { BagVerdictCard } from '../BagVerdictCard';
import { ScanModeStep } from '../ScanModeStep';
import { ScanOutcomeStep } from '../ScanOutcomeStep';

import { ScanDoneStep } from './ScanDoneStep';

/** One stage of the scan at a time, chosen where the stage is named. */
export const ScanStageContent = ({ scan }: { readonly scan: BagScan }): JSX.Element => {
  const { t } = useTranslation();

  if (scan.stage === BAG_SCAN_STAGES.mode) {
    return <ScanModeStep onChoose={scan.chooseMode} />;
  }

  if (scan.stage === BAG_SCAN_STAGES.capture) {
    return (
      <BagPhotoStep
        isWorking={scan.photo.isWorking}
        issues={scan.photo.issues}
        onCapture={scan.capture}
        onSkip={scan.skipPhoto}
      />
    );
  }

  if (scan.stage === BAG_SCAN_STAGES.label) {
    return <BagLabelForm scan={scan} />;
  }

  if (scan.stage === BAG_SCAN_STAGES.verdict) {
    return scan.verdict.view === null ? (
      <LoadingState label={t(TRANSLATION_KEYS.scanVerdictWaiting)} />
    ) : (
      <>
        <BagVerdictCard
          verdict={scan.verdict.view}
          coffeeName={scan.label.name}
          roaster={scan.label.roaster}
        />
        <ScanOutcomeStep scan={scan} />
      </>
    );
  }

  return <ScanDoneStep scan={scan} />;
};
