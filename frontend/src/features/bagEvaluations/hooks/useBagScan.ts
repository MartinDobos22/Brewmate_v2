import { lowConfidenceFieldNames, type ParsedBagFieldName } from '@brewmate/shared';
import { useState } from 'react';

import { usePrefetchCoffeeTaste } from '../../coffeeTaste/hooks';
import { useCreateCoffeeBag } from '../../inventory/hooks';
import {
  EMPTY_COFFEE_BAG_FORM,
  parsedBagToForm,
  toCreateCoffeeBagRequest,
  toParsedBagData,
  type CoffeeBagFormValues,
} from '../../inventory/services';
import {
  BAG_SCAN_MODES,
  BAG_SCAN_STAGES,
  type BagScanMode,
  type BagScanStage,
} from '../constants/bagScan';
import { BAG_CAPTURE_RESULTS } from '../constants/bagPhoto';
import type { BagPhotoSource } from '../services/pickBagPhoto';

import { useBagPhoto, type BagCapture, type BagPhoto } from './useBagPhoto';
import { useBagOutcome, type BagOutcome } from './useBagOutcome';
import { useBagVerdict, type BagVerdict } from './useBagVerdict';

const NOTHING_UNVERIFIED: readonly ParsedBagFieldName[] = [];

export interface BagScan {
  readonly stage: BagScanStage;
  readonly mode: BagScanMode;
  readonly label: CoffeeBagFormValues;
  readonly unverified: readonly ParsedBagFieldName[];
  readonly photo: BagPhoto;
  readonly verdict: BagVerdict;
  readonly outcome: BagOutcome;
  readonly isSaving: boolean;
  readonly hasFailed: boolean;
  readonly chooseMode: (mode: BagScanMode) => void;
  readonly capture: (source: BagPhotoSource) => void;
  readonly skipPhoto: () => void;
  readonly describeLabel: (patch: Partial<CoffeeBagFormValues>) => void;
  readonly submit: (fallbackName: string) => void;
  readonly reset: () => void;
}

/**
 * One bag, from the shelf to an answer.
 *
 * Two modes over one parsing layer. The photograph is taken, uploaded and read
 * identically either way; what differs is the last step - an opinion about
 * whether to buy it, or a row in the cupboard.
 *
 * Every stage can be reached without a camera. The photograph is an offer, not
 * a gate: nobody standing in a shop should be unable to ask a question because
 * the light is bad or the signal is worse.
 */
export const useBagScan = (initialMode?: BagScanMode): BagScan => {
  const photo = useBagPhoto();
  const verdict = useBagVerdict();
  const prefetchTaste = usePrefetchCoffeeTaste();
  const createBag = useCreateCoffeeBag();
  const [stage, setStage] = useState<BagScanStage>(
    initialMode === undefined ? BAG_SCAN_STAGES.mode : BAG_SCAN_STAGES.capture,
  );
  const [mode, setMode] = useState<BagScanMode>(initialMode ?? BAG_SCAN_MODES.verdict);
  const [label, setLabel] = useState<CoffeeBagFormValues>(EMPTY_COFFEE_BAG_FORM);
  const [unverified, setUnverified] = useState<readonly ParsedBagFieldName[]>(NOTHING_UNVERIFIED);
  const outcome = useBagOutcome(verdict.evaluationId, (): void => {
    setStage(BAG_SCAN_STAGES.done);
  });

  const saveToCupboard = (fallbackName: string): void => {
    createBag.mutate(toCreateCoffeeBagRequest(label, fallbackName), {
      onSuccess: (): void => {
        setStage(BAG_SCAN_STAGES.done);
      },
    });
  };

  return {
    stage,
    mode,
    label,
    unverified,
    photo,
    verdict,
    outcome,
    isSaving: createBag.isPending || verdict.isPending,
    hasFailed: createBag.isError || verdict.hasFailed || outcome.hasFailed,

    chooseMode: (chosen: BagScanMode): void => {
      setMode(chosen);
      setStage(photo.isSupported ? BAG_SCAN_STAGES.capture : BAG_SCAN_STAGES.label);
    },

    /**
     * Backing out of the camera leaves somebody where they were, and so does a
     * photograph that came back unreadable - that one with reasons printed
     * above the button they are about to press again. Everything else moves on
     * to the form, with whatever was read already in it.
     */
    capture: (source: BagPhotoSource): void => {
      void photo.capture(source).then(({ outcome, fields }: BagCapture): void => {
        if (outcome === BAG_CAPTURE_RESULTS.cancelled || outcome === BAG_CAPTURE_RESULTS.refused) {
          return;
        }

        if (fields !== null) {
          setLabel(parsedBagToForm(fields));
          setUnverified(lowConfidenceFieldNames(fields));
        }

        setStage(BAG_SCAN_STAGES.label);
      });
    },

    skipPhoto: (): void => {
      setStage(BAG_SCAN_STAGES.label);
    },

    describeLabel: (patch: Partial<CoffeeBagFormValues>): void => {
      setLabel({ ...label, ...patch });
    },

    submit: (fallbackName: string): void => {
      if (mode === BAG_SCAN_MODES.inventory) {
        saveToCupboard(fallbackName);

        return;
      }

      const coffee = toParsedBagData(label);

      setStage(BAG_SCAN_STAGES.verdict);

      /**
       * The label is read for taste before the verdict is asked for, not
       * after.
       *
       * Both calls happen either way and the screen shows the same waiting
       * state throughout, so this costs nothing - but in the other order the
       * verdict for a coffee nobody had scanned before was argued from the
       * label's own arithmetic alone, and the closer reading reached the
       * shared cache a moment after the sentence that needed it.
       */
      void prefetchTaste(coffee).then((): void => {
        void verdict.ask(coffee, photo.imageUrl);
      });
    },

    /**
     * Back to the beginning - to the mode question, or straight to the camera
     * for somebody the cupboard sent here, who never saw that question.
     */
    reset: (): void => {
      setLabel(EMPTY_COFFEE_BAG_FORM);
      setUnverified(NOTHING_UNVERIFIED);
      photo.forget();
      verdict.forget();
      outcome.forget();
      setStage(initialMode === undefined ? BAG_SCAN_STAGES.mode : BAG_SCAN_STAGES.capture);
    },
  };
};
