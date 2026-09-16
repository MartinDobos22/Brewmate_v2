import type { LabelPhotoIssue, ParsedBagFields } from '@brewmate/shared';
import { useState } from 'react';

import { getErrorTracker } from '../../../lib/errorTracking';
import { useAuthSession } from '../../auth/context';
import { BAG_CAPTURE_RESULTS, type BagPhotoFailure } from '../constants/bagPhoto';
import { parseCoffeeBag } from '../services/coffeeBagAiApi';
import { pickBagPhoto, type BagPhotoSource } from '../services/pickBagPhoto';
import { readLocalPhoto } from '../services/readLocalPhoto';
import { resolvePhotoFailure } from '../services/resolvePhotoFailure';

export type BagCaptureOutcome = (typeof BAG_CAPTURE_RESULTS)[keyof typeof BAG_CAPTURE_RESULTS];

export interface BagCapture {
  readonly outcome: BagCaptureOutcome;
  /** What was read, or null for every outcome except a successful reading. */
  readonly fields: ParsedBagFields | null;
}

export interface BagPhoto {
  readonly isSupported: boolean;
  readonly isWorking: boolean;
  /**
   * Which step gave up, and null while none has.
   *
   * Named rather than a flag, because the screen has a different sentence for
   * each and only one of them is worth trying again on the spot.
   */
  readonly failure: BagPhotoFailure | null;
  /**
   * Why the last photograph was refused, empty when it was not.
   *
   * Kept on the hook rather than returned once, because the screen that has to
   * print it is the camera screen somebody stays on - the whole point of a
   * refusal is that the next photograph is taken from the same place.
   */
  readonly issues: readonly LabelPhotoIssue[];
  /**
   * Takes or chooses a photograph and reads the label off it.
   *
   * Never throws. A refused permission, an upload that will not go and a label
   * nothing could be read from are all `unavailable`, and all of them end on
   * the form: somebody in a shop must never be stuck behind a photograph.
   */
  readonly capture: (source: BagPhotoSource) => Promise<BagCapture>;
  readonly forget: () => void;
}

const CANCELLED: BagCapture = { outcome: BAG_CAPTURE_RESULTS.cancelled, fields: null };
const UNAVAILABLE: BagCapture = { outcome: BAG_CAPTURE_RESULTS.unavailable, fields: null };
const REFUSED: BagCapture = { outcome: BAG_CAPTURE_RESULTS.refused, fields: null };
const NOTHING = 0;
const NO_ISSUES: readonly LabelPhotoIssue[] = [];

/**
 * One photograph of a bag, from the camera to the fields it was read into.
 *
 * The whole chain lives in one hook because it only ever happens as one
 * gesture, and because every step of it can fail in a way that has the same
 * answer: put the form in front of the user with whatever was read so far.
 *
 * There is nothing to configure for it any more. It used to need a storage
 * bucket and report itself unsupported without one; the photograph travels in
 * the request now, so a scan needs exactly what every other screen needs -
 * somebody signed in and an API to ask.
 */
export const useBagPhoto = (): BagPhoto => {
  const { user } = useAuthSession();
  const [isWorking, setWorking] = useState(false);
  const [failure, setFailure] = useState<BagPhotoFailure | null>(null);
  const [issues, setIssues] = useState<readonly LabelPhotoIssue[]>(NO_ISSUES);

  /**
   * Records a failure and reports it under its own name.
   *
   * The reporting is the point. These used to be swallowed by a bare `catch`,
   * which left the screen with no way to say what had let go and left nothing
   * anywhere to read afterwards either.
   */
  const noteFailure = (stage: BagPhotoFailure, error: unknown): BagCapture => {
    setFailure(stage);
    getErrorTracker().capture(error, { action: stage });

    return UNAVAILABLE;
  };

  return {
    isWorking,
    failure,
    issues,
    isSupported: user !== null,

    capture: async (source: BagPhotoSource): Promise<BagCapture> => {
      const localUri = await pickBagPhoto(source);

      if (localUri === null) {
        return CANCELLED;
      }

      if (user === null) {
        return UNAVAILABLE;
      }

      setWorking(true);
      setFailure(null);
      setIssues(NO_ISSUES);

      try {
        const photo = await readLocalPhoto(localUri);
        const { fields, photoIssues } = await parseCoffeeBag(photo);

        /*
         * A photograph the API would not read is the one failure worth
         * staying put for. It came back with reasons, every one of them a
         * thing to do differently, and the camera is still in somebody's
         * hand: moving them to an empty form here would throw that away and
         * then ask them to type in the label they are pointing at.
         */
        if (photoIssues !== null && photoIssues.length > NOTHING) {
          setIssues(photoIssues);

          return REFUSED;
        }

        return { outcome: BAG_CAPTURE_RESULTS.read, fields };
      } catch (error: unknown) {
        /*
         * Nothing was read, which is not the same as having read nothing.
         * Handing back a set of empty fields would have the caller overwrite
         * whatever is already on the form with them - harmless while there is
         * only one way to reach the camera, and a way to lose a label the
         * moment there is a second.
         */
        return noteFailure(resolvePhotoFailure(error), error);
      } finally {
        setWorking(false);
      }
    },

    forget: (): void => {
      setFailure(null);
      setIssues(NO_ISSUES);
    },
  };
};
