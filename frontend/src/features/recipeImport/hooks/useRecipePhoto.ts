import { useState } from 'react';

import { isPhotoScanningConfigured } from '../../../config';
import { useAuthSession } from '../../auth/context';
import { pickBagPhoto, uploadBagPhoto, type BagPhotoSource } from '../../bagEvaluations/services';
import { RECIPE_PHOTO_FOLDER } from '../constants';

export interface RecipePhoto {
  readonly isSupported: boolean;
  readonly isWorking: boolean;
  readonly hasFailed: boolean;
  /**
   * Takes or chooses a picture and uploads it.
   *
   * @returns the URL, or null for every way this can end without one - a
   * refused permission, somebody backing out of the camera, an upload that
   * would not go. All of them land on the same place: the form, where the
   * recipe can be typed in instead.
   */
  readonly capture: (source: BagPhotoSource) => Promise<string | null>;
}

/**
 * One picture of a recipe, from the camera to a URL the API can read.
 *
 * The same walk-and-retry upload a coffee label goes through, because it is
 * the same failure: a connection that comes and goes. A build with no storage
 * bucket reports itself unsupported rather than failing when the button is
 * pressed - pasting text has to work without any of this anyway.
 */
export const useRecipePhoto = (): RecipePhoto => {
  const { user } = useAuthSession();
  const [isWorking, setWorking] = useState(false);
  const [hasFailed, setFailed] = useState(false);

  return {
    isWorking,
    hasFailed,
    isSupported: isPhotoScanningConfigured() && user !== null,

    capture: async (source: BagPhotoSource): Promise<string | null> => {
      const localUri = await pickBagPhoto(source);

      if (localUri === null || user === null) {
        return null;
      }

      setWorking(true);
      setFailed(false);

      try {
        return await uploadBagPhoto(localUri, user.uid, RECIPE_PHOTO_FOLDER);
      } catch {
        setFailed(true);

        return null;
      } finally {
        setWorking(false);
      }
    },
  };
};
