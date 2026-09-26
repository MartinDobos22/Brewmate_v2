import { CUP_EXTRACTIONS, CUP_STRENGTHS } from '@brewmate/shared';

import { PROMPT_LINE_SEPARATOR } from '../constants/promptFormatting.js';

/** The key's own line in an answer's list of keys. */
export const CUP_READING_KEY_LINE =
  '- "cupReading": either null, or what they said about how this cup came out, in brewing terms. See below.';

/**
 * How the model is asked to read "bola kyslá" into something a brew can be
 * corrected by.
 *
 * Shared by the conversation after a cup and the dial-in, because it is one
 * question asked in two places and the brewing profile reads both answers the
 * same way. The instruction says what the field is for - a model told that a
 * guess here becomes somebody's habit guesses less.
 */
export const CUP_READING_SECTION = [
  'WHAT THEY SAID ABOUT THE CUP ITSELF',
  '',
  `"cupReading" is {"extraction": "${CUP_EXTRACTIONS.under}" | "${CUP_EXTRACTIONS.over}" | "${CUP_EXTRACTIONS.balanced}" | null, "strength": "${CUP_STRENGTHS.weak}" | "${CUP_STRENGTHS.strong}" | "${CUP_STRENGTHS.right}" | null}. It is recorded against the cup they brewed and teaches Brewmate where their grind, their temperature and their ratio should sit next time. It describes the cup, never what they like.`,
  '',
  `"extraction": "${CUP_EXTRACTIONS.under}" when they describe it as sour, sharp, thin, hollow or salty; "${CUP_EXTRACTIONS.over}" when bitter, harsh, drying or astringent; "${CUP_EXTRACTIONS.balanced}" when they say it was right - sweet, clean, nothing they would change.`,
  `"strength": "${CUP_STRENGTHS.weak}" when watery or thin in flavour; "${CUP_STRENGTHS.strong}" when too heavy or too concentrated; "${CUP_STRENGTHS.right}" when they say the strength was fine.`,
  '',
  'Only what they actually said about this cup, in words about its taste. A field they did not speak to is null, and a message that is not about a cup at all - a question, a plan, a thank-you - is null altogether. Timings and weights you already have as numbers; do not read them into this. A guess here becomes a habit the app builds on, so when in doubt, leave it null. A cup that was sour because something was missing was still sour: record what the cup was, and explain the missing piece in the reply.',
].join(PROMPT_LINE_SEPARATOR);
