/**
 * The taste profile as the user reads it: five axes, a handful of flavour
 * tags, and how much of it Brewmate is actually sure about.
 *
 * The confidence line matters more than the chart. A profile built from one
 * questionnaire is a guess, and a guess drawn as a neat bar chart stops
 * looking like one.
 */
export const SK_TASTE_PROFILE = {
  axisAcidity: 'Kyslosť',
  axisSweetness: 'Sladkosť',
  axisBody: 'Telo',
  axisBitterness: 'Horkosť',
  axisIntensity: 'Intenzita',

  flavorFruity: 'Ovocné',
  flavorCitrus: 'Citrusy',
  flavorBerry: 'Bobule',
  flavorFloral: 'Kvetinové',
  flavorHerbal: 'Bylinkové',
  flavorNutty: 'Orechové',
  flavorCaramel: 'Karamel',
  flavorChocolate: 'Čokoláda',
  flavorSpice: 'Korenie',
  flavorTeaLike: 'Čajové',

  profileTasteTitle: 'Tvoja chuť',
  profileTasteChartLabel: 'Graf tvojej chuti v piatich osiach',
  profileAxisUnknown: 'Zatiaľ neviem',
  profileTasteEmpty: 'Zatiaľ o tvojej chuti nič neviem. Vyplň dotazník a začneme.',
  profileConfidenceTitle: 'Ako dobre ťa poznám',
  profileConfidenceNone: 'Zatiaľ vôbec',
  profileConfidenceLow: 'Len zhruba',
  profileConfidenceMedium: 'Celkom slušne',
  profileConfidenceHigh: 'Dobre',
  profileConfidenceHint:
    'Číslo je počet káv, ktoré si ohodnotil. Každá ma naučí viac než dotazník.',

  confidenceNoticeNone: 'Zatiaľ o tvojej chuti neviem nič. Toto je bežné odporúčanie, nie tvoje.',
  confidenceNoticeQuestionnaire:
    'Zatiaľ ťa poznám len z dotazníka. Ber to ako začiatok, nie ako pravdu o tebe.',
  confidenceNoticeFewRatings:
    'Poznám ťa zatiaľ z dotazníka a z pár káv, ktoré si ohodnotil. Čím viac ich ohodnotíš, tým lepšie budem radiť.',

  profileConfidenceBoostTitle: 'Čo mi pomôže spoznať ťa lepšie',
  profileConfidenceBoostRate: 'Ohodnoť kávu, ktorú piješ - v polovici balíčka a keď ho dopiješ.',
  profileConfidenceBoostWhy:
    'To ma posunie najviac, lebo si ju naozaj pil. Niečo mi povie aj každý balíček, ktorý si zapíšeš.',
  profileConfidenceBoostAction: 'Otvoriť moju kávu',

  profileRoastPreference: 'Praženie',
  profileMilkUsage: 'Mlieko',
  profileRoastLight: 'Svetlé',
  profileRoastMediumLight: 'Svetlejšie stredné',
  profileRoastMedium: 'Stredné',
  profileRoastMediumDark: 'Tmavšie stredné',
  profileRoastDark: 'Tmavé',
  profileRoastNone: 'Bez preferencie',
  profileMilkNever: 'Nikdy',
  profileMilkSometimes: 'Občas',
  profileMilkOften: 'Väčšinou',
  profileMilkAlways: 'Vždy',
  profileMilkNone: 'Nepovedal si',

  profileRetakeAction: 'Vyplniť dotazník znova',
  profileTuneAction: 'Nastaviť hodnoty ručne',
  profileTuneTitle: 'Ručné doladenie',
  profileTuneBody: 'Posuň, čo ti nesedí. Tvoje slovo má prednosť pred mojím odhadom.',
  profileTuneSave: 'Uložiť moje hodnoty',
  profileTuneError: 'Hodnoty sa nepodarilo uložiť. Skús to prosím znova.',

  profileEquipmentTitle: 'Vybavenie',
  profileEquipmentEmpty: 'Zatiaľ nemáš zapísané žiadne vybavenie.',
  profileWaterTitle: 'Voda',
  profileSetsTitle: 'Zostavy',
  profileTypeGrinder: 'Mlynček',
  profileTypeBrewer: 'Príprava',
  profileTypeKettle: 'Kanvica',
  profileTypeScale: 'Váha',
  profileEquipmentUnnamed: 'Bez názvu',
  profileEquipmentRemove: 'Odstrániť',
} as const;
