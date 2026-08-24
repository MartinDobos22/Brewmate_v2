/**
 * Ladenie espressa.
 *
 * Krátke vety - človek drží šálku, ktorá chladne. A jedna zmena naraz, lebo
 * shot, pri ktorom sa hýbali dve veci, nehovorí nič: vyšiel inak a nedá sa
 * povedať, ktorá zmena za to môže.
 */
export const SK_DIAL_IN = {
  dialInTitle: 'Ladenie espressa',
  dialInIntro:
    'Nová káva na pákovači. Uvar shot, napíš mi, ako dopadol, a ja ti poviem jednu vec, ktorú zmeniť.',
  dialInOpening: 'Uvar prvý shot podľa odhadu nižšie a napíš mi, ako vytiekol a ako chutí.',

  dialInShotSection: 'Ako dopadol shot',
  dialInShotTime: 'Čas (s)',
  dialInShotYield: 'V šálke (g)',
  dialInShotDose: 'Dávka (g)',
  dialInShotTaste: 'Ako chutil',
  dialInShotTastePlaceholder: 'Napríklad: kyslé a tenké',
  dialInSend: 'Pošli shot',
  dialInSending: 'Posielam...',
  dialInError: 'Toto sa teraz nepodarilo. Shot mám zapísaný, skús to o chvíľu znova.',
  dialInMissingShot: 'Doplň čas aj to, koľko ti vytieklo do šálky.',
  dialInMessageTemplate: 'Vytieklo to za {time} s, v šálke mám {yield} g. {taste}',
  dialInNoTaste: 'Chuť zatiaľ neviem opísať.',

  dialInTimelineTitle: 'Priebeh ladenia',
  dialInShotNumber: '{number}. shot',
  dialInShotFacts: '{dose} g → {yield} g za {time} s',
  dialInGrindAt: 'mletie {setting}',
  dialInChangeSummary: '{change} {direction} - {trend}',
  dialInChangeGrind: 'zmenilo sa mletie',
  dialInChangeDose: 'zmenila sa dávka',
  dialInChangeNone: 'bez zmeny',
  dialInDirectionFiner: 'jemnejšie',
  dialInDirectionCoarser: 'hrubšie',
  dialInDirectionMore: 'viac',
  dialInDirectionLess: 'menej',
  dialInTrendCloser: 'bližšie k cieľu',
  dialInTrendFurther: 'ďalej od cieľa',
  dialInTrendSteady: 'bez posunu',

  dialInFinish: 'Toto je ono, ulož to',
  dialInFinishing: 'Ukladám...',
  dialInFinished: 'Uložené ako obľúbený recept pre túto kávu.',
} as const;
