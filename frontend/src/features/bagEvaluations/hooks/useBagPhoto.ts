import {
  EMPTY_PARSED_BAG_FIELDS,
  type LabelPhotoIssue,
  type ParsedBagFields,
} from '@brewmate/shared';
import { useState } from 'react';

import { isPhotoScanningConfigured } from '../../../config';
import { useAuthSession } from '../../auth/context';
import { BAG_CAPTURE_RESULTS } from '../constants/bagPhoto';
import { parseCoffeeBag } from '../services/coffeeBagAiApi';
import { pickBagPhoto, type BagPhotoSource } from '../services/pickBagPhoto';
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
  readonly hasFailed: boolean;
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
  const [hasFailed, setFailed] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [issues, setIssues] = useState<readonly LabelPhotoIssue[]>(NO_ISSUES);

  return {
    isWorking,
    hasFailed,
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
      setFailed(false);
      setIssues(NO_ISSUES);

      try {
        const uploaded = await uploadBagPhoto(localUri, user.uid);
        const { fields, photoIssues } = await parseCoffeeBag(uploaded);

        /*
         * A photograph the API would not read is the one failure worth
         * staying put for. It came back with reasons, every one of them a
         * thing to do differently, and the camera is still in somebody's hand:
         * moving them to an empty form here would throw that away and then ask
         * them to type in the label they are pointing at.
         */
        if (photoIssues !== null && photoIssues.length > NOTHING) {
          setIssues(photoIssues);

          return REFUSED;
        }

        setImageUrl(uploaded);

        return { outcome: BAG_CAPTURE_RESULTS.read, fields };
      } catch {
        setFailed(true);

        return { outcome: BAG_CAPTURE_RESULTS.unavailable, fields: EMPTY_PARSED_BAG_FIELDS };
      } finally {
        setWorking(false);
      }
    },

    forget: (): void => {
      setImageUrl(null);
      setFailed(false);
      setIssues(NO_ISSUES);
    },
  };
};
