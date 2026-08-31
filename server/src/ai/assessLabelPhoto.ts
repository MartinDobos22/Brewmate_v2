import { LABEL_PHOTO_ISSUES, type LabelPhotoIssue } from '@brewmate/shared';

import {
  LABEL_LUMINANCE_MAX,
  LABEL_LUMINANCE_MIN,
  LABEL_TEXT_MIN_CHARACTERS,
  LABEL_TEXT_MIN_CONFIDENCE,
} from './constants/labelPhotoLimits.js';

const NOTHING = 0;

/** What the optical reader observed, before any of it means anything. */
export interface LabelPhotoEvidence {
  readonly text: string;
  /** One entry per word the reader made out, as it rated its own reading. */
  readonly wordConfidences: readonly number[];
  /** The picture's overall brightness, or null when it was not measured. */
  readonly luminance: number | null;
}

const NO_ISSUES: readonly LabelPhotoIssue[] = [];

const average = (values: readonly number[]): number =>
  values.reduce((total: number, value: number): number => total + value, NOTHING) / values.length;

/**
 * Darkness and glare, which never refuse a photograph and only ever explain
 * one that was refused for another reason.
 */
const describeLighting = (luminance: number | null): readonly LabelPhotoIssue[] => {
  if (luminance === null) {
    return NO_ISSUES;
  }

  if (luminance < LABEL_LUMINANCE_MIN) {
    return [LABEL_PHOTO_ISSUES.tooDark];
  }

  return luminance > LABEL_LUMINANCE_MAX ? [LABEL_PHOTO_ISSUES.tooBright] : NO_ISSUES;
};

/**
 * Whether this photograph is worth spending a model call on, and if not, why
 * not.
 *
 * Two things refuse it and neither is a matter of taste. Nothing legible came
 * off it at all, or what did come off it the reader could barely make out -
 * and a transcript of guesses is worse than no transcript, because a model
 * handed one reads it as fact. Everything else is an observation: a dim
 * picture that read perfectly is a good picture, and the app has no business
 * sending somebody back to a shelf over it.
 *
 * The lighting is appended to a refusal rather than causing one, because the
 * only thing anybody can do with a refusal is take another photograph, and
 * "nothing was legible, it was very dark" is an instruction where "nothing was
 * legible" is a dead end.
 *
 * @returns the reasons to refuse, empty when there are none.
 */
export const assessLabelPhoto = ({
  text,
  wordConfidences,
  luminance,
}: LabelPhotoEvidence): readonly LabelPhotoIssue[] => {
  const lighting = describeLighting(luminance);

  if (text.trim().length < LABEL_TEXT_MIN_CHARACTERS) {
    return [LABEL_PHOTO_ISSUES.noText, ...lighting];
  }

  /*
   * A reader that transcribed words without rating them has said nothing about
   * how sharp the picture was, and an unrated transcript is not evidence of a
   * blurred photograph. It goes through.
   */
  if (wordConfidences.length === NOTHING) {
    return NO_ISSUES;
  }

  return average(wordConfidences) < LABEL_TEXT_MIN_CONFIDENCE
    ? [LABEL_PHOTO_ISSUES.unsharp, ...lighting]
    : NO_ISSUES;
};
