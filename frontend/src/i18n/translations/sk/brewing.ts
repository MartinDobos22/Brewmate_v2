/**
 * Recipes, quick brewing and the brewing history.
 *
 * The quick brew copy carries one promise, and it is the reason the flow
 * exists: nobody has to fill in a database before they are allowed to make a
 * cup of coffee. Every sentence here is written so that "neviem" is a normal
 * answer rather than an obstacle.
 */
export const SK_BREWING = {
  recipeDose: 'Dávka',
  recipeWater: 'Voda',
  recipeRatio: 'Pomer',
  recipeTemperature: 'Teplota',
  recipeGrindNote: 'Mletie nastav na stredné.',
  recipeNoTemperatureNote: 'Nemáš reguláciu teploty, tak vodu po zovretí nechaj minútu stáť.',
  recipeNoScaleNote: 'Bez váhy ber dávku ako dve zarovnané polievkové lyžice.',

  quickBrewTitle: 'Rýchle varenie',
  quickBrewIntro:
    'Nemusíš mať kávu zapísanú. Povedz mi, v čom ju ideš pripraviť, a čo o nej vieš - pokojne aj nič - a navrhnem ti recept.',

  quickBrewMethodTitle: 'V čom to ideš variť?',
  quickBrewMethodEmptyTitle: 'Ešte neviem, v čom variš',
  quickBrewMethodEmptyBody:
    'Stačí zaškrtnúť, čo máš doma, a hneď ti navrhnem recept. Radiť ti prípravu, ktorú nemáš z čoho urobiť, nemá zmysel.',
  quickBrewMethodEmptyAction: 'Doplniť vybavenie',

  quickBrewCoffeeTitle: 'Čo o tej káve vieš?',
  quickBrewCoffeeBody:
    'Pokojne nič. Čokoľvek doplníš, recept spresní - ale aj bez toho ti nejaký navrhnem.',
  quickBrewCoffeeNameLabel: 'Káva',
  quickBrewCoffeeNamePlaceholder: 'Napríklad: Etiópia z pražiarne za rohom',
  quickBrewRoastLabel: 'Praženie',
  quickBrewRoastUnknown: 'Neviem',
  quickBrewSubmit: 'Navrhni mi recept',
  quickBrewCoffeeOptionalNote: 'Nič z toho nie je povinné. Keď o káve nevieš nič, rovno pokračuj.',
  quickBrewRationale:
    'Rýchle varenie. Vychádza z tvojho vybavenia a z toho, čo si o káve vedel povedať.',

  quickBrewRecipeTitle: 'Tvoj recept',
  quickBrewRecipeNoBagNote: 'Túto kávu nemáš zapísanú, a nevadí. Recept si pamätám aj tak.',
  quickBrewAddToInventoryTitle: 'Zapíšeme si tú kávu?',
  quickBrewAddToInventoryBody:
    'Keď ju budem mať v inventári, budem vedieť, koľko jej ostáva a ako ti pri nej chutilo.',
  quickBrewAddToInventoryAction: 'Pridať do inventára',
  quickBrewAddToInventorySkip: 'Netreba, mám hotovo',
  quickBrewUnnamedCoffee: 'Káva bez názvu',
  quickBrewSavedTitle: 'Zapísané',
  quickBrewSavedBody: 'Kávu nájdeš v inventári. Zvyšné údaje si k nej môžeš doplniť kedykoľvek.',
  quickBrewSavedAction: 'Hotovo',
  quickBrewError: 'Recept sa nepodarilo pripraviť. Skús to prosím znova.',
  quickBrewSaveError: 'Kávu sa nepodarilo pridať. Skús to prosím znova.',

  brewHistoryTitle: 'Tvoje varenia',
  brewHistoryEmptyTitle: 'Prvé varenie ešte len príde',
  brewHistoryEmptyBody: 'Po prvom uvarení sa tu objaví:',
  brewHistoryEmptyPointRecipe: 'recept, podľa ktorého si varil, aj s dávkou a pomerom,',
  brewHistoryEmptyPointWords: 'to, čo si o tej káve povedal vlastnými slovami,',
  brewHistoryEmptyPointChange: 'a čo som podľa toho zmenil v ďalšom odporúčaní.',
  brewHistoryEmptyWhy:
    'Oplatí sa to: už po pár vareniach viem, či ti mám radiť jemnejšie mletie alebo kratší čas - namiesto toho, aby som hádal.',
  brewHistoryEmptyAction: 'Uvariť prvú kávu',
  brewHistoryHasBrewsBody:
    'Prvé varenie máš za sebou. Podrobný prehľad varení pribudne sem, ako ich bude viac.',
  brewHistoryOpenAction: 'Uvariť ďalšiu',
} as const;
