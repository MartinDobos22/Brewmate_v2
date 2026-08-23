import { EMPTY_PARSED_BAG_FIELDS, type ParsedBagFields } from '@brewmate/shared';
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

  return {
    isWorking,
    hasFailed,
    imageUrl,
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

      try {
        const uploaded = await uploadBagPhoto(localUri, user.uid);
        const { fields } = await parseCoffeeBag(uploaded);

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
    },
  };
};
