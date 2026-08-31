import type { CoffeeBag } from '@brewmate/shared';
import type { JSX } from 'react';

import { BagPhotoStep } from '../../../bagEvaluations/components';
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

/** One stage of the coffee question at a time, chosen where the stage is named. */
export const CoffeeSourceStageContent = ({
  source,
  onChoose,
  onUnrecorded,
}: CoffeeSourceStageContentProps): JSX.Element => {
  if (source.stage === COFFEE_SOURCE_STAGES.inventory) {
    return (
      <CoffeeSourceBagList
        onChoose={onChoose}
        onPhotograph={source.openCamera}
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
      onPhotograph={source.openCamera}
      onInventory={source.openInventory}
      onUnrecorded={onUnrecorded}
    />
  );
};
