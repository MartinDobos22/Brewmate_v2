import { z } from 'zod';

/**
 * Why a photograph of a label could not be read.
 *
 * Four, and only four, because these are the four things an optical reader can
 * actually answer for. Anything beyond them - "the bag is creased", "the label
 * is at an angle" - would be a guess dressed up as a diagnosis, and a wrong
 * instruction about how to retake a photograph is worse than none: somebody
 * standing in a shop follows it, gets the same refusal, and stops trusting the
 * screen.
 *
 * `noText` and `unsharp` are the two that refuse a photograph on their own.
 * `tooDark` and `tooBright` never do: a dim photograph whose text came out
 * legible is a good photograph. They travel alongside one of the first two, as
 * the explanation of it - "nothing was legible, and here is the likely reason"
 * is an instruction somebody can act on, where "nothing was legible" is not.
 */
export const LABEL_PHOTO_ISSUES = {
  noText: 'noText',
  unsharp: 'unsharp',
  tooDark: 'tooDark',
  tooBright: 'tooBright',
} as const;

export const LABEL_PHOTO_ISSUE_VALUES = [
  LABEL_PHOTO_ISSUES.noText,
  LABEL_PHOTO_ISSUES.unsharp,
  LABEL_PHOTO_ISSUES.tooDark,
  LABEL_PHOTO_ISSUES.tooBright,
] as const;

export const labelPhotoIssueSchema = z.enum(LABEL_PHOTO_ISSUE_VALUES);

export type LabelPhotoIssue = z.infer<typeof labelPhotoIssueSchema>;
