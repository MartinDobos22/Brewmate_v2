/**
 * What the model calls cost, and what happens when they run out.
 *
 * The sentence this screen exists for is the last one: an account at its
 * ceiling has lost the things that ask a model a question and nothing else.
 * Varenie z uloženého receptu, ručné pridanie kávy a celá história fungujú
 * ďalej - and saying so is the difference between a limit and a punishment.
 */
export const SK_AI_COSTS = {
  aiCostsTitle: 'Náklady a limity',
  aiCostsSubtitle: 'Koľko z toho, na čo sa dá pýtať modelu, si už minul.',

  aiCostsDayTitle: 'Dnes',
  aiCostsMonthTitle: 'Tento mesiac',
  aiCostsCalls: '{used} z {limit} otázok',
  aiCostsSpent: '{spent} z {limit}',
  aiCostsResetsAt: 'Obnoví sa {time}',
  aiCostsExhaustedCalls: 'Počet otázok si na toto obdobie vyčerpal.',
  aiCostsExhaustedCost: 'Sumu si na toto obdobie vyčerpal.',

  aiCostsByFunctionTitle: 'Kde to šlo',
  aiCostsByFunctionEmpty: 'Tento mesiac si sa modelu na nič nepýtal.',
  aiCostsFunctionCalls: '{count}×',
  aiCostsAmount: '{value} {currency}',

  aiCostsFunctionParseCoffeeBag: 'Čítanie balíčkov',
  aiCostsFunctionEvaluateCoffee: 'Rada v obchode',
  aiCostsFunctionGenerateRecipe: 'Písanie receptov',
  aiCostsFunctionRecipeChat: 'Konverzácia po káve',
  aiCostsFunctionParseRecipe: 'Čítanie cudzích receptov',
  aiCostsFunctionConvertRecipe: 'Prepočet na tvoju výbavu',
  aiCostsFunctionEspressoDialIn: 'Ladenie espressa',
  aiCostsFunctionTuneProfile: 'Zhrnutie z histórie',
  aiCostsFunctionUnknown: 'Ostatné',

  aiCostsWhatCountsTitle: 'Čo sa do toho ráta',
  aiCostsWhatCountsBody:
    'Len to, čo sa naozaj pýta modelu. Varenie z uloženého receptu, ručné pridanie kávy, prezeranie histórie aj celý inventár fungujú vždy a nič nestoja.',

  privacyTitle: 'Tvoje dáta',
  privacyExportBody:
    'Stiahneš si všetko, čo o tebe mám: profil, výbavu, kávy, recepty, konverzácie, varenia aj záznamy o tom, na čo som sa pýtal modelu.',
  privacyExportAction: 'Stiahnuť moje dáta',
  privacyExportPreparing: 'Pripravujem súbor…',
  privacyExportFailed: 'Súbor sa nepodarilo pripraviť. Skús to prosím znova.',
  privacyExportFileName: 'brewmate-moje-data.json',
  privacyExportShareTitle: 'Moje dáta z Brewmate',
  privacyDeleteNote: 'Zmazanie účtu nájdeš nižšie. Zmaže presne to isté, čo je v tomto súbore.',
} as const;
