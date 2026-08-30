/**
 * The cupboard and the screen before a recipe.
 *
 * Both used to be a column of identical cards ending in a stack of identical
 * grey buttons. What changed is not the wording but what the screens are
 * *for*: the cupboard now answers "what do I drink this morning" from the top
 * down, and the brewing screen shows what is about to be brewed before it asks
 * anybody to commit to it.
 *
 * Counts are printed after a colon rather than inside a sentence. Slovak
 * agrees a noun with its number three different ways, and "1 balíček",
 * "3 balíčky" and "5 balíčkov" cannot be one template.
 */
export const SK_CUPBOARD_AND_BREW = {
  inventorySummaryBags: 'Balíčky',
  inventorySummaryRemaining: 'Zostáva',
  inventorySummaryReady: 'Pripravené',
  inventorySummaryUnweighed: 'Nezvážené',
  inventorySummaryLabel: 'Čo máš v skrinke',

  inventoryTileScanTitle: 'Naskenovať balíček',
  inventoryTileScanCaption: 'Odfoť etiketu, prepíšem ju za teba.',
  inventoryTileManualTitle: 'Zadať ručne',
  inventoryTileManualCaption: 'Keď je etiketa nečitateľná alebo žiadna.',
  inventoryTileGrindersTitle: 'Katalóg mlynčekov',
  inventoryTileGrindersCaption: 'Nájdi ten svoj alebo pridaj chýbajúci.',

  inventoryGroupIdeal: 'Pripravené na varenie',
  inventoryGroupIdealCaption: 'Tieto sú presne v okne, kedy dávajú najviac.',
  inventoryGroupAging: 'Dopi ich čoskoro',
  inventoryGroupAgingCaption: 'Od praženia ubehlo dosť. Ešte majú čo dať, ale nie dlho.',
  inventoryGroupPastPeak: 'Najlepšie majú za sebou',
  inventoryGroupPastPeakCaption: 'Stále dobré. Len už nie na vrchole.',
  inventoryGroupResting: 'Ešte odpočívajú',
  inventoryGroupRestingCaption: 'Nechaj ich pár dní. Potom to bude iná káva.',
  inventoryGroupUnknown: 'Bez dátumu praženia',
  inventoryGroupUnknownCaption: 'Neviem, ako sú staré - tak k nim nič netvrdím.',

  inventoryBagRemainingLabel: 'Koľko z balíčka ostáva',

  bagDetailBrewTitle: 'Uvariť z nej',
  bagDetailBrewCaption: 'Otvorím varenie s touto kávou.',
  bagDetailLabelSection: 'Čo je na balíčku',
  bagDetailLabelCaption: 'Len to, čo je naozaj zapísané - nič nedopĺňam.',
  bagDetailLabelEmpty: 'Z balíčka nemám zapísané nič ďalšie. Kávu to nepokazí.',
  bagDetailRecipesCaption:
    'Zvlášť pre každú metódu - rovnaké zrná chcú v inom prekvapkávači iné čísla.',
  bagRecipesEmptyAction: 'Uvariť z nej prvú kávu',
  bagRecipeDose: 'Dávka',
  bagRecipeRatio: 'Pomer',

  preBrewCoffeeReady: 'Pripravená',
  preBrewMethodCategoryPourOver: 'Prelievaná',
  preBrewMethodCategoryImmersion: 'Lúhovaná',
  preBrewMethodCategoryEspresso: 'Espresso',
  preBrewMethodCategoryCold: 'Studená',
  preBrewMethodCategoryStovetop: 'Na sporáku',
  preBrewMethodCategoryBatch: 'Prekvapkávač',

  preBrewPlanTitle: 'Čo ideš variť',
  preBrewPlanCoffee: 'Káva',
  preBrewPlanMethod: 'Metóda',
  preBrewPlanAmounts: 'Dávka a voda',
  preBrewPlanRatio: 'Pomer',
  preBrewPlanUnknownCoffee: 'Nezapísaná káva',
} as const;
