import {
  COLOR_CHANNEL_MAX,
  LUMINANCE_BLUE_WEIGHT,
  LUMINANCE_GREEN_WEIGHT,
  LUMINANCE_RED_WEIGHT,
} from './constants/labelPhotoLimits.js';
import type { LabelPhotoEvidence } from './assessLabelPhoto.js';
import type { VisionAnnotation } from './visionAnnotateSchema.js';

const NOTHING = 0;
const EMPTY = '';

/** Every word the reader rated, flattened out of the page it was found on. */
const readWordConfidences = (annotation: VisionAnnotation): readonly number[] =>
  (annotation.fullTextAnnotation?.pages ?? []).flatMap((page): readonly number[] =>
    (page.blocks ?? []).flatMap((block): readonly number[] =>
      (block.paragraphs ?? []).flatMap((paragraph): readonly number[] =>
        (paragraph.words ?? []).flatMap((word): readonly number[] =>
          word.confidence === undefined ? [] : [word.confidence],
        ),
      ),
    ),
  );

/**
 * How bright the photograph is, weighted by how much of it each colour covers.
 *
 * The dominant colours are what this API reports about a picture's light, and
 * weighting them by their share is the difference between "there is a black
 * region in this photograph" and "this photograph is dark". Unweighted, a
 * white label on a dark counter and a white label in the dark come out the
 * same.
 *
 * @returns the luminance, or null when the API reported no colours to measure.
 */
const readLuminance = (annotation: VisionAnnotation): number | null => {
  const colors = annotation.imagePropertiesAnnotation?.dominantColors?.colors ?? [];
  const measured = colors.filter(
    (entry): boolean => entry.color !== undefined && entry.pixelFraction !== undefined,
  );
  const coverage = measured.reduce(
    (total: number, entry): number => total + (entry.pixelFraction ?? NOTHING),
    NOTHING,
  );

  if (coverage <= NOTHING) {
    return null;
  }

  const weighted = measured.reduce((total: number, entry): number => {
    const red = entry.color?.red ?? NOTHING;
    const green = entry.color?.green ?? NOTHING;
    const blue = entry.color?.blue ?? NOTHING;
    const luminance =
      (LUMINANCE_RED_WEIGHT * red + LUMINANCE_GREEN_WEIGHT * green + LUMINANCE_BLUE_WEIGHT * blue) /
      COLOR_CHANNEL_MAX;

    return total + luminance * (entry.pixelFraction ?? NOTHING);
  }, NOTHING);

  return weighted / coverage;
};

/** One annotation, reduced to the three observations a verdict is drawn from. */
export const readVisionAnnotation = (annotation: VisionAnnotation): LabelPhotoEvidence => ({
  text: annotation.fullTextAnnotation?.text ?? EMPTY,
  wordConfidences: readWordConfidences(annotation),
  luminance: readLuminance(annotation),
});
