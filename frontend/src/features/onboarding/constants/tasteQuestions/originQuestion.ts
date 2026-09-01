import { TRANSLATION_KEYS } from '../../../../i18n';
import { FLAVOR_TAGS } from '../../../tasteProfile/constants';
import type { TasteQuestion } from '../../services/tasteQuestionTypes';

import { QUESTION_LEVELS } from './questionLevels';
import { QUESTION_WEIGHTS } from './questionWeights';

/**
 * Expert only, and behavioural rather than stated: which shelf they keep
 * coming back to.
 *
 * Somebody who buys Kenyan repeatedly has demonstrated a preference for a kind
 * of cup far more convincingly than any answer about acidity, because they
 * paid for it several times. It is weighed as behaviour rather than as a
 * preference for the reason the insights screen already states out loud -
 * people also buy what the shop had, and what they were given as a present.
 *
 * Asked of experts only because the answer requires having drunk enough of
 * each to have a favourite; a beginner picking a country here would be
 * answering a geography question.
 */
export const ORIGIN_QUESTION: TasteQuestion = {
  id: 'origin',
  promptKey: TRANSLATION_KEYS.tqOriginPrompt,
  helpKey: TRANSLATION_KEYS.tqOriginHelp,
  weight: QUESTION_WEIGHTS.behaviour,
  levels: QUESTION_LEVELS.expertOnly,
  options: [
    {
      id: 'ethiopia',
      labelKey: TRANSLATION_KEYS.tqOriginEthiopia,
      noteKey: TRANSLATION_KEYS.tqOriginEthiopiaNote,
      effect: {
        axes: { acidity: 8.5, sweetness: 7, body: 3.5 },
        flavorAffinities: {
          [FLAVOR_TAGS.floral]: 0.7,
          [FLAVOR_TAGS.berry]: 0.6,
          [FLAVOR_TAGS.teaLike]: 0.5,
        },
      },
    },
    {
      id: 'kenya',
      labelKey: TRANSLATION_KEYS.tqOriginKenya,
      noteKey: TRANSLATION_KEYS.tqOriginKenyaNote,
      effect: {
        axes: { acidity: 9, sweetness: 6.5, body: 6 },
        flavorAffinities: { [FLAVOR_TAGS.berry]: 0.7, [FLAVOR_TAGS.citrus]: 0.6 },
      },
    },
    {
      id: 'colombia',
      labelKey: TRANSLATION_KEYS.tqOriginColombia,
      noteKey: TRANSLATION_KEYS.tqOriginColombiaNote,
      effect: {
        axes: { acidity: 6, sweetness: 7.5, body: 6 },
        flavorAffinities: { [FLAVOR_TAGS.caramel]: 0.5, [FLAVOR_TAGS.fruity]: 0.4 },
      },
    },
    {
      id: 'brazil',
      labelKey: TRANSLATION_KEYS.tqOriginBrazil,
      noteKey: TRANSLATION_KEYS.tqOriginBrazilNote,
      effect: {
        axes: { acidity: 3, sweetness: 7, body: 8, intensity: 7 },
        flavorAffinities: { [FLAVOR_TAGS.nutty]: 0.7, [FLAVOR_TAGS.chocolate]: 0.6 },
      },
    },
    {
      id: 'indonesia',
      labelKey: TRANSLATION_KEYS.tqOriginIndonesia,
      noteKey: TRANSLATION_KEYS.tqOriginIndonesiaNote,
      effect: {
        axes: { acidity: 2.5, body: 9, bitterness: 6.5, intensity: 8 },
        flavorAffinities: { [FLAVOR_TAGS.spice]: 0.7, [FLAVOR_TAGS.herbal]: 0.5 },
      },
    },
    { id: 'noFavourite', labelKey: TRANSLATION_KEYS.tqOriginNone, effect: {} },
  ],
};
