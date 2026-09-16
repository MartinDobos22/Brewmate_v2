import type { LabelPhotoIssue, ParsedBagFields } from '@brewmate/shared';
import { useState } from 'react';

import { isPhotoScanningConfigured } from '../../../config';
import { getErrorTracker } from '../../../lib/errorTracking';
import { useAuthSession } from '../../auth/context';
import {
  BAG_CAPTURE_RESULTS,
  BAG_PHOTO_FAILURES,
  type BagPhotoFailure,
} from '../constants/bagPhoto';
import { parseCoffeeBag } from '../services/coffeeBagAiApi';
import { pickBagPhoto, type BagPhotoSource } from '../services/pickBagPhoto';
import { resolveUploadFailure } from '../services/resolveUploadFailure';
import { uploadBagPhoto } from '../services/uploadBagPhoto';

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
   * Which half of the chain gave up, and null while neither has.
   *
   * Named rather than a flag, because the screen has a different sentence for
   * each and only one of the two is worth trying again on the spot.
   */
  readonly failure: BagPhotoFailure | null;
  readonly imageUrl: string | null;
  /**
   * Why the last photograph was refused, empty when it was not.
   *
   * Kept on the hook rather than returned once, because the screen that has to
   * print it is the camera screen somebody stays on - the whole point of a
   * refusal is that the next photograph is taken from the same place.
   */
  readonly issues: readonly LabelPhotoIssue[];
  /**
   * Takes or chooses a photograph, uploads it and reads the label.
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
 * A build with no storage bucket reports `isSupported: false` rather than
 * failing when the button is pressed - typing a label in has to work without
 * any of this anyway.
 */
export const useBagPhoto = (): BagPhoto => {
  const { user } = useAuthSession();
  const [isWorking, setWorking] = useState(false);
  const [failure, setFailure] = useState<BagPhotoFailure | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [issues, setIssues] = useState<readonly LabelPhotoIssue[]>(NO_ISSUES);

  /**
   * Records a failure and reports it under its own name.
   *
   * The reporting is the point. Both of these used to be swallowed by a bare
   * `catch`, which left the one screen that depends on three separate services
   * - a picker, a bucket and the API - with no way to say which of them had
   * let go, on either side of the wire. An upload that never happens leaves no
   * trace on the API at all, so without this there is nothing anywhere to read.
   */
  const noteFailure = (stage: BagPhotoFailure, error: unknown): BagCapture => {
    setFailure(stage);
    getErrorTracker().capture(error, { action: stage });

    return UNAVAILABLE;
  };

  return {
    isWorking,
    failure,
    imageUrl,
    issues,
    isSupported: isPhotoScanningConfigured() && user !== null,

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
        let uploaded: string;

        try {
          uploaded = await uploadBagPhoto(localUri, user.uid);
        } catch (error: unknown) {
          return noteFailure(resolveUploadFailure(error), error);
        }

        try {
          const { fields, photoIssues } = await parseCoffeeBag(uploaded);

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

          setImageUrl(uploaded);

          return { outcome: BAG_CAPTURE_RESULTS.read, fields };
        } catch (error: unknown) {
          /*
           * Nothing was read, which is not the same as having read nothing.
           * Handing back a set of empty fields would have the caller overwrite
           * whatever is already on the form with them - harmless while there
           * is only one way to reach the camera, and a way to lose a label the
           * moment there is a second.
           */
          return noteFailure(BAG_PHOTO_FAILURES.read, error);
        }
      } finally {
        setWorking(false);
      }
    },

    forget: (): void => {
      setImageUrl(null);
      setFailure(null);
      setIssues(NO_ISSUES);
    },
  };
};
