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
  profileTasteEmpty: 'Zatiaľ o tvojej chuti nič neviem. Vyplň dotazník a začneme.',
  profileConfidenceTitle: 'Ako dobre ťa poznám',
  profileConfidenceNone: 'Zatiaľ vôbec',
  profileConfidenceLow: 'Len zhruba',
  profileConfidenceMedium: 'Celkom slušne',
  profileConfidenceHigh: 'Dobre',
  profileConfidenceBrewsLabel: 'Varení, z ktorých som sa učil',
  profileConfidenceHint: 'Číslo rastie s každým varením, ktoré mi opíšeš.',

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

  profileRetakeTitle: 'Doladiť chuť',
  profileRetakeAction: 'Vyplniť dotazník znova',
  profileTuneAction: 'Nastaviť hodnoty ručne',
  profileTuneTitle: 'Ručné doladenie',
  profileTuneBody: 'Posuň, čo ti nesedí. Tvoje slovo má prednosť pred mojím odhadom.',
  profileTuneSave: 'Uložiť moje hodnoty',
  profileTuneError: 'Hodnoty sa nepodarilo uložiť. Skús to prosím znova.',

  profileEquipmentTitle: 'Vybavenie',
  profileEquipmentEmpty: 'Zatiaľ nemáš zapísané žiadne vybavenie.',
  profileEquipmentManage: 'Upraviť vybavenie',
  profileWaterTitle: 'Voda',
  profileSetsTitle: 'Zostavy',
  profileTypeGrinder: 'Mlynček',
  profileTypeBrewer: 'Príprava',
  profileTypeKettle: 'Kanvica',
  profileTypeScale: 'Váha',
  profileEquipmentUnnamed: 'Bez názvu',
  profileEquipmentRemove: 'Odstrániť',
} as const;
