import { lowConfidenceFieldNames, type CoffeeBag, type ParsedBagFieldName } from '@brewmate/shared';
import { useState } from 'react';

import { BAG_CAPTURE_RESULTS } from '../../bagEvaluations/constants';
import { useBagPhoto, type BagCapture, type BagPhoto } from '../../bagEvaluations/hooks';
import type { BagPhotoSource } from '../../bagEvaluations/services';
import { useCreateCoffeeBag } from '../../inventory/hooks';
import {
  EMPTY_COFFEE_BAG_FORM,
  parsedBagToForm,
  toCreateCoffeeBagRequest,
  type CoffeeBagFormValues,
} from '../../inventory/services';
import { COFFEE_SOURCE_STAGES, type CoffeeSourceStage } from '../constants/coffeeSource';

const NOTHING_UNVERIFIED: readonly ParsedBagFieldName[] = [];

export interface CoffeeSource {
  readonly stage: CoffeeSourceStage;
  readonly photo: BagPhoto;
  readonly label: CoffeeBagFormValues;
  readonly unverified: readonly ParsedBagFieldName[];
  readonly isSaving: boolean;
  readonly hasFailed: boolean;
  readonly openCamera: () => void;
  readonly openInventory: () => void;
  readonly capture: (source: BagPhotoSource) => void;
  readonly skipPhoto: () => void;
  readonly describeLabel: (patch: Partial<CoffeeBagFormValues>) => void;
  readonly keepLabel: (fallbackName: string) => void;
  readonly back: () => void;
}

/**
 * One coffee, from a shelf or from a camera, on its way into a brew.
 *
 * A photographed bag is written into the cupboard rather than carried along as
 * a sentence, and that is the decision this hook exists to make. The engine
 * can be handed either a bag or free text, and the free-text path loses
 * exactly the two facts that change a recipe most - the roast level and the
 * date it was roasted. Somebody photographing a bag at the counter owns that
 * coffee and is about to brew it; asking them to describe it in words when the
 * label has just been read for them would be throwing the reading away and
 * making the recipe worse for it.
 *
 * The camera is an offer here as it is everywhere else. A refused photograph
 * stays on the camera step with reasons; anything else that goes wrong lands
 * on the form with whatever was read so far, and the form always saves.
 */
export const useCoffeeSource = (onChoose: (bag: CoffeeBag) => void): CoffeeSource => {
  const photo = useBagPhoto();
  const createBag = useCreateCoffeeBag();
  const [stage, setStage] = useState<CoffeeSourceStage>(COFFEE_SOURCE_STAGES.choice);
  const [label, setLabel] = useState<CoffeeBagFormValues>(EMPTY_COFFEE_BAG_FORM);
  const [unverified, setUnverified] = useState<readonly ParsedBagFieldName[]>(NOTHING_UNVERIFIED);

  return {
    stage,
    photo,
    label,
    unverified,
    isSaving: createBag.isPending,
    hasFailed: createBag.isError,

    openCamera: (): void => {
      /*
       * A build with no storage bucket has no camera to open, and the tile
       * that leads here is hidden in one. Typing the label in is the same
       * screen either way, so the step it lands on is the honest one rather
       * than a camera that would fail when pressed.
       */
      setStage(photo.isSupported ? COFFEE_SOURCE_STAGES.photo : COFFEE_SOURCE_STAGES.label);
    },

    openInventory: (): void => {
      setStage(COFFEE_SOURCE_STAGES.inventory);
    },

    capture: (source: BagPhotoSource): void => {
      void photo.capture(source).then(({ outcome, fields }: BagCapture): void => {
        if (outcome === BAG_CAPTURE_RESULTS.cancelled || outcome === BAG_CAPTURE_RESULTS.refused) {
          return;
        }

        if (fields !== null) {
          setLabel(parsedBagToForm(fields));
          setUnverified(lowConfidenceFieldNames(fields));
        }

        setStage(COFFEE_SOURCE_STAGES.label);
      });
    },

    skipPhoto: (): void => {
      setStage(COFFEE_SOURCE_STAGES.label);
    },

    describeLabel: (patch: Partial<CoffeeBagFormValues>): void => {
      setLabel({ ...label, ...patch });
    },

    keepLabel: (fallbackName: string): void => {
      createBag.mutate(toCreateCoffeeBagRequest(label, fallbackName), {
        onSuccess: (bag: CoffeeBag): void => {
          onChoose(bag);
        },
      });
    },

    back: (): void => {
      photo.forget();
      setStage(COFFEE_SOURCE_STAGES.choice);
    },
  };
};
