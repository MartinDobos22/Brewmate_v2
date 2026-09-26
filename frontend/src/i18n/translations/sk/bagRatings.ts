/**
 * Rating a bag - halfway through it, and once it is gone.
 *
 * The stars are the answer and everything under them is optional. The
 * impression is the part a yes-or-no would have flattened: a coffee can be
 * fine and still not what somebody chose it for, or good only on the mornings
 * the recipe lands, or not a ten at a price where a ten was never the point.
 * Every tag is about the coffee rather than the brew, because what these
 * ratings teach is what to buy next.
 */
export const SK_BAG_RATINGS = {
  bagRatingHalfwayTitle: 'Ako ti zatiaľ chutí?',
  bagRatingHalfwayBody:
    'Si asi v polovici balíčka. Podľa toho ti budem lepšie radiť, akú kávu kúpiť.',
  bagRatingFinishedTitle: 'Ako ti chutila?',
  bagRatingFinishedBody:
    'Balíček je preč. Povedz mi, ako ti sadla - naučím sa z toho, čo ti kupovať.',
  bagRatingStarsLabel: 'Hodnotenie',
  bagRatingStarSpoken: '{count} z 5 hviezdičiek',

  bagRatingImpressionTitle: 'Ako to s ňou celkovo vidíš?',
  bagRatingImpressionAsExpected: 'Presne toto som chcel',
  bagRatingImpressionDifferent: 'Chutí mi, ale čakal som niečo iné',
  bagRatingImpressionRecipeDependent: 'Chutí mi len niekedy, záleží na recepte',
  bagRatingImpressionGoodValue: 'Nie je to top, ale za tie peniaze v pohode',
  bagRatingImpressionWouldNotBuy: 'Už by som si ju nekúpil',

  bagRatingLikedTitle: 'Čo ti na nej sedelo',
  bagRatingDislikedTitle: 'Čo ti vadilo',
  bagRatingTagSweet: 'Sladkosť',
  bagRatingTagFruity: 'Ovocnosť',
  bagRatingTagChocolate: 'Čokoláda',
  bagRatingTagNutty: 'Orechy a karamel',
  bagRatingTagBrightAcidity: 'Živá kyslosť',
  bagRatingTagFullBody: 'Plné telo',
  bagRatingTagTooSour: 'Príliš kyslá',
  bagRatingTagTooBitter: 'Príliš horká',
  bagRatingTagTooHeavy: 'Príliš ťažká',
  bagRatingTagFlat: 'Bez výraznej chuti',

  bagRatingSave: 'Uložiť hodnotenie',
  bagRatingSkipFinished: 'Preskočiť, len ju dopiť',
  bagRatingClose: 'Zavrieť',
  bagRatingSaveError: 'Hodnotenie sa nepodarilo uložiť. Skús to prosím znova.',

  bagRatingPromptTitle: 'Ako ti zatiaľ chutí?',
  bagRatingPromptCaption: 'Si asi v polovici balíčka. Ohodnoť ju, nech viem, čo ti kupovať.',

  bagRatingCardTitle: 'Tvoje hodnotenie',
  bagRatingCardCaption: 'Z toho sa učím, akú kávu ti odporučiť v obchode.',
  bagRatingCardHalfway: 'V polovici balíčka',
  bagRatingCardFinished: 'Po dopití',
  bagRatingCardNotYet: 'Zatiaľ bez hodnotenia',
  bagRatingCardRate: 'Ohodnotiť',
  bagRatingCardChange: 'Zmeniť',
} as const;
