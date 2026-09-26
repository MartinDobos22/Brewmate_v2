import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';

import { LoadingState } from '../../../../components/ui';
import { TRANSLATION_KEYS, useTranslation } from '../../../../i18n';
import { BagPhotoStep } from '../../../bagEvaluations/components';
import { BAG_PHOTO_SOURCES } from '../../../bagEvaluations/services';
import { COFFEE_SOURCE_STAGES } from '../../constants';
import type { CoffeeSource } from '../../hooks/useCoffeeSource';

import { CoffeeSourceBagList } from './CoffeeSourceBagList';
import { CoffeeSourceLabelForm } from './CoffeeSourceLabelForm';
import { CoffeeSourceTiles } from './CoffeeSourceTiles';

export interface CoffeeSourceStageContentProps {
  readonly source: CoffeeSource;
  readonly onChoose: (bag: CoffeeBag) => void;
  /** The honest answer that this coffee is not written down anywhere. */
  readonly onUnrecorded: () => void;
}

/**
 * One stage of the coffee question at a time, chosen where the stage is named.
 *
 * A label being read wins over every stage. The camera and the library open
 * straight from the question and from an empty cupboard, so the reading
 * happens wherever somebody happened to be standing - and whichever that was,
 * the screen should be saying it is reading rather than offering the tiles
 * that started it.
 */
export const CoffeeSourceStageContent = ({
  source,
  onChoose,
  onUnrecorded,
}: CoffeeSourceStageContentProps): JSX.Element => {
  const { t } = useTranslation();

  if (source.photo.isWorking) {
    return <LoadingState label={t(TRANSLATION_KEYS.scanPhotoReading)} />;
  }

  if (source.stage === COFFEE_SOURCE_STAGES.inventory) {
    return (
      <CoffeeSourceBagList
        onChoose={onChoose}
        onPhotograph={(): void => {
          source.capture(BAG_PHOTO_SOURCES.camera);
        }}
        onBack={source.back}
      />
    );
  }

  if (source.stage === COFFEE_SOURCE_STAGES.photo) {
    return (
      <BagPhotoStep
        isWorking={source.photo.isWorking}
        issues={source.photo.issues}
        onCapture={source.capture}
        onSkip={source.skipPhoto}
      />
    );
  }

  if (source.stage === COFFEE_SOURCE_STAGES.label) {
    return <CoffeeSourceLabelForm source={source} />;
  }

  return (
    <CoffeeSourceTiles
      canPhotograph={source.photo.isSupported}
      onCapture={source.capture}
      onInventory={source.openInventory}
      onTypeIn={source.skipPhoto}
      onUnrecorded={onUnrecorded}
    />
  );
};
