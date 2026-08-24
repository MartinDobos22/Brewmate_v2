/**
 * The history and what it adds up to.
 *
 * Two screens with one rule between them: everything printed here is a count
 * of something that happened, and the copy says so out loud. Nothing in this
 * product has ever measured how much somebody liked a cup, and a screen that
 * quietly turned "uvaril si to jedenásťkrát" into "toto ti chutí" would be
 * inventing the one thing it does not know.
 */
export const SK_HISTORY = {
  historyTimelineTitle: 'Ako sa recept vyvíjal',
  historyTimelineSubtitle: 'Každá verzia, čo si o nej povedal a čo z nej vyšlo.',
  historyTimelineEmptyTitle: 'Zatiaľ tu nič nie je',
  historyTimelineEmptyBody:
    'Keď na túto kávu uvaríš prvý recept, nájdeš tu jeho verzie aj to, čo si o nich napísal.',
  historyTimelineOpenAction: 'Ako sa to vyvíjalo',

  historyVersionLabel: 'Verzia {number}',
  historyVersionLatest: 'Najnovšia',
  historyVersionFirst: 'Prvá',
  historyBrewCount: 'Uvarené: {count}',
  historyBrewCountNone: 'Zatiaľ neuvarené',
  historyMessageCount: 'Poznámky: {count}',
  historyMessagesTrimmed: 'Zobrazujem posledných {count}.',
  historyOpenChat: 'Otvoriť konverzáciu',

  historyConstrainedBadge: 'Chýbalo niečo',
  historyConstrainedNote:
    'Aspoň jedna z týchto káv bola varená bez niečoho z výbavy - preto mohla dopadnúť inak, než hovorí recept.',

  insightsTitle: 'Čo hovorí tvoja história',
  insightsSubtitle: 'Počítam z {count} káv, pri ktorých viem, akú kávu si mal.',
  insightsCountsNotRatings:
    'Sú to počty, nie hodnotenia. Koľkokrát si čo uvaril - nie ako veľmi ti to chutilo. To som nikdy nemeral.',
  insightsTooFewTitle: 'Zatiaľ je toho málo',
  insightsTooFewBody:
    'Uvar aspoň {count} káv zo zapísaných balíčkov a poviem ti, čo sa v nich opakuje.',
  insightsOpenAction: 'História a prehľad',

  insightsAttributeOrigin: 'Pôvod',
  insightsAttributeProcess: 'Spracovanie',
  insightsAttributeRoastLevel: 'Praženie',
  insightsValueCounts: '{brews} káv z {bags} balíčkov',
  insightsValuePinned: 'z toho {count} s uloženým receptom',

  suggestionTitle: 'Mám to zapísať do profilu?',
  suggestionRoastLine: 'Z {total} káv malo {count} praženie „{value}“.',
  suggestionNoteLine: 'Poznámku „{value}“ mali balíčky pri {count} kávach.',
  suggestionClosing:
    'Vychádzam z toho, čo si varil, nie z toho, čo si mi povedal. Ak to tak nie je, pokojne odmietni - nezmení sa nič.',
  suggestionWrittenByPhone: 'Toto zhrnutie zložil telefón z čísel vyššie.',
  suggestionChangesTitle: 'Čo by sa zmenilo',
  suggestionChangeRoast: 'Obľúbené praženie: {value}',
  suggestionChangeNotes: 'Chuťové poznámky, ktoré začnem očakávať: {values}',
  suggestionAccept: 'Áno, zapíš to',
  suggestionDismiss: 'Nie, to nesedí',
  suggestionAccepted: 'Zapísané. Profil som prepočítal.',
  suggestionDismissed: 'Dobre. Kým sa história nezmení, pýtať sa nebudem.',
  suggestionSeparator: ', ',
} as const;
