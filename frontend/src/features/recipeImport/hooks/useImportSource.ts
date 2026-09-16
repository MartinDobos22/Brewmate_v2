import { EMPTY_SOURCE_RECIPE, type Photo, type SourceRecipe } from '@brewmate/shared';
import { useState } from 'react';

import type { BagPhotoSource } from '../../bagEvaluations/services';
import { toSourceRecipeForm, type SourceRecipeFormValues } from '../services/sourceRecipeForm';

import { useParseRecipe } from './useParseRecipe';
import { useRecipePhoto, type RecipePhoto } from './useRecipePhoto';

const EMPTY = '';

export interface ImportSource {
  readonly text: string;
  readonly photo: Photo | null;
  readonly camera: RecipePhoto;
  readonly isReading: boolean;
  readonly hasFailed: boolean;
  /** Whether there is anything to read at all. */
  readonly canRead: boolean;
  readonly write: (text: string) => void;
  readonly addPhoto: (from: BagPhotoSource) => void;
  /** Reads what is there and hands back the fields, or nothing on a failure. */
  readonly read: (onRead: (source: SourceRecipe, form: SourceRecipeFormValues) => void) => void;
}

/**
 * Whatever form somebody has the recipe in, turned into fields.
 *
 * The photograph is an offer, not a gate - exactly as it is on the scanner.
 * Pasting text works with no camera permission at all, and typing the recipe
 * in works without even that.
 * Every failure along the way lands on the same form rather than on a message
 * telling somebody to try again later.
 */
export const useImportSource = (): ImportSource => {
  const camera = useRecipePhoto();
  const parse = useParseRecipe();
  const [text, setText] = useState(EMPTY);
  const [photo, setPhoto] = useState<Photo | null>(null);

  return {
    text,
    photo,
    camera,
    isReading: parse.isPending || camera.isWorking,
    hasFailed: parse.isError || camera.hasFailed,
    canRead: text.trim() !== EMPTY || photo !== null,

    write: setText,

    addPhoto: (from: BagPhotoSource): void => {
      void camera.capture(from).then(setPhoto);
    },

    read: (onRead): void => {
      parse.mutate(
        {
          text: text.trim() === EMPTY ? null : text.trim(),
          photo,
        },
        {
          onSuccess: ({ source }): void => {
            onRead(source, toSourceRecipeForm(source));
          },
          /**
           * A recipe nothing could be read out of still gets a form, with
           * every box empty. Somebody who has the recipe in front of them can
           * type it in, and telling them to go away and try again would be the
           * app refusing to do the part it can still do.
           */
          onError: (): void => {
            onRead(EMPTY_SOURCE_RECIPE, toSourceRecipeForm(EMPTY_SOURCE_RECIPE));
          },
        },
      );
    },
  };
};
