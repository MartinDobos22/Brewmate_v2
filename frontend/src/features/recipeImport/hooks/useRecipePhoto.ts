import type { Photo } from '@brewmate/shared';
import { useState } from 'react';

import { getErrorTracker } from '../../../lib/errorTracking';
import { useAuthSession } from '../../auth/context';
import {
  pickBagPhoto,
  readLocalPhoto,
  resolvePhotoFailure,
  type BagPhotoSource,
} from '../../bagEvaluations/services';

export interface RecipePhoto {
  readonly isSupported: boolean;
  readonly isWorking: boolean;
  readonly hasFailed: boolean;
  /**
   * Takes or chooses a picture of a recipe.
   *
   * @returns the photograph, or null for every way this can end without one -
   * a refused permission, somebody backing out of the camera, a file that was
   * gone by the time it was read. All of them land on the same place: the
   * form, where the recipe can be typed in instead.
   */
  readonly capture: (source: BagPhotoSource) => Promise<Photo | null>;
}

/**
 * One picture of a recipe, on its way into the parse request.
 *
 * It used to be uploaded to a bucket and travel as a URL, the way a coffee
 * label did, with the same walk-and-retry behind it. The picture goes in the
 * request body now - there is nothing to upload to and nothing to retry, and
 * the recipe can still be pasted in as text without any of this.
 */
export const useRecipePhoto = (): RecipePhoto => {
  const { user } = useAuthSession();
  const [isWorking, setWorking] = useState(false);
  const [hasFailed, setFailed] = useState(false);

  return {
    isWorking,
    hasFailed,
    isSupported: user !== null,

    capture: async (source: BagPhotoSource): Promise<Photo | null> => {
      const localUri = await pickBagPhoto(source);

      if (localUri === null || user === null) {
        return null;
      }

      setWorking(true);
      setFailed(false);

      try {
        return await readLocalPhoto(localUri);
      } catch (error: unknown) {
        setFailed(true);

        /*
         * Reported rather than swallowed, as everywhere else on this path. A
         * picture that cannot be read off the phone leaves no trace anywhere
         * else, so a bare `catch` here means a failure nobody can see.
         */
        getErrorTracker().capture(error, { action: resolvePhotoFailure(error) });

        return null;
      } finally {
        setWorking(false);
      }
    },
  };
};
