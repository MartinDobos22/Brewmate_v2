/**
 * The screen before the recipe.
 *
 * Every sentence here is written so that a missing piece of gear is an
 * ordinary thing to say rather than a confession. "Dnes nemám všetko" is the
 * heading a person can open without feeling caught out - and what is behind it
 * changes the recipe, so it has to be easy enough to answer honestly.
 */
export const SK_PRE_BREW = {
  preBrewTitle: 'Čo dnes varíme?',
  preBrewIntro: 'Povedz mi, z čoho a v čom variš. Recept ti napíšem až potom, keď to bude sedieť.',

  /*
   * The first screen of a brew: which coffee, and how the app learns about it.
   *
   * Both tiles are written as things somebody is already doing - holding a bag,
   * or standing in front of a cupboard - rather than as features. Neither
   * caption promises a result: the camera says what it will try to read, not
   * that it will succeed, because the one thing this flow must never do is
   * make a refused photograph feel like a broken app.
   */
  preBrewSourceTitle: 'Akú kávu ideš variť?',
  preBrewSourceIntro: 'Odfoť balíček, alebo si vyber niečo, čo už máš v skrinke.',
  preBrewSourcePhoto: 'Odfotím balíček',
  preBrewSourcePhotoCaption: 'Z etikety prečítam, čo sa dá, a zapíšem ti ju do skrinky.',
  preBrewSourceInventory: 'Mám ju v skrinke',
  preBrewSourceInventoryCaption: 'Vyber si z toho, čo máš doma.',
  preBrewSourceUnrecordedHint: 'Alebo ani jedno - recept ti napíšem aj tak.',
  preBrewSourceBack: 'Späť na výber',
  preBrewSourceEmptyTitle: 'V skrinke zatiaľ nič nemáš',
  preBrewSourceEmptyBody: 'Odfoť balíček, ktorý máš po ruke - zapíšem ti ho a hneď z neho uvaríme.',
  preBrewSourceLabelTitle: 'Rozumiem tomu takto',
  preBrewSourceLabelHint: 'Prepíš, čo vidíš na balíčku. Prázdne polia ničomu nevadia.',
  preBrewSourceKeep: 'Ulož a variť',

  preBrewCoffeeSection: 'Káva',
  preBrewCoffeeChoose: 'Vyber si kávu',
  preBrewCoffeeChange: 'Zmeniť kávu',
  preBrewCoffeeNone: 'Nemám ju zapísanú',
  preBrewCoffeeNoneHint: 'Recept ti napíšem aj tak. Bez údajov o káve bude opatrnejší.',
  preBrewCoffeeDescriptionLabel: 'Čo o nej vieš?',
  preBrewCoffeeDescriptionPlaceholder: 'Napríklad: svetlá etiópia, kúpená minulý týždeň',
  preBrewCoffeeEmpty: 'V skrinke zatiaľ nič nemáš.',
  preBrewCoffeeRemaining: 'Zostáva',

  preBrewMethodSection: 'Príprava',
  preBrewMethodHint: 'Ponúkam len to, na čo máš v tejto sade vybavenie.',
  preBrewMethodEmpty: 'V tejto sade nemáš zapísané nič, v čom sa dá variť.',
  preBrewMethodEmptyAction: 'Doplniť vybavenie',

  preBrewConstraintsTitle: 'Dnes nemám všetko',
  preBrewConstraintsClosed: 'Zaškrtni, čo ti dnes chýba - recept podľa toho prepíšem.',
  preBrewConstraintsCount: 'chýba ti {count}',
  preBrewConstraintsFromSet: 'Predvyplnené podľa sady. Pre toto varenie to môžeš zmeniť.',

  constraintNoTemperatureControl: 'Nemám reguláciu teploty',
  constraintNoTemperatureControlHint: 'Obyčajná kanvica, ktorá vie len zovrieť.',
  constraintNoScale: 'Nemám váhu',
  constraintNoScaleHint: 'Dávku aj vodu ti prepočítam na lyžice a decilitre.',
  constraintNoGooseneck: 'Nemám gooseneck kanvicu',
  constraintNoGooseneckHint: 'Prúd sa nedá presne mieriť ani spomaliť.',
  constraintUnknownWater: 'Neviem, akú mám vodu',
  constraintUnknownWaterHint: 'Cudzí byt, chata, kohútik, o ktorom nič neviem.',
  constraintNoTimer: 'Nemám stopky',
  constraintNoTimerHint: 'Časy ti nahradím tým, čo uvidíš na lôžku.',
  constraintNoGrinder: 'Nemám mlynček',
  constraintNoGrinderHint: 'Káva je už namletá, mletie sa nedá zmeniť.',
  constraintFixedGrindSetting: 'Mletie neviem prestaviť',
  constraintFixedGrindSettingHint: 'Mlynček je nastavený a ostáva tak.',
  constraintBorrowedEquipment: 'Vybavenie nie je moje',
  constraintBorrowedEquipmentHint: 'Požičané veci, ktoré ešte nepoznám.',
  constraintLimitedTime: 'Nemám veľa času',
  constraintLimitedTimeHint: 'Chcem to čo najkratšie, aj za cenu kompromisu.',

  preBrewWaterSection: 'Voda',
  preBrewWaterHint: 'Predvyplnené z profilu. Pre toto varenie to môžeš zmeniť.',

  preBrewImportRecipe: 'Mám recept odinakiaľ',
  preBrewStartDialIn: 'Nová káva - poď ju vyladiť',
  preBrewAmountsSection: 'Dávka a pomer',
  preBrewDoseLabel: 'Káva',
  preBrewWaterLabel: 'Voda',
  preBrewYieldLabel: 'Výtlačok',
  preBrewRatioLabel: 'Pomer',
  preBrewAmountsHint: 'Zmeň ktorékoľvek číslo a zvyšné sa dopočítajú.',
  preBrewSuggestionNote: 'Toto som ti predvyplnil ja. Posledné slovo máš ty.',
  preBrewSuggestionReason: 'Vychádzam zo stredu pomeru pre {method} a z toho, čo drží tvoj brewer.',

  preBrewOverCapacity: 'Toľko vody sa ti do brewera nezmestí. Zmestí sa zhruba {capacity} g.',
  preBrewOverRemaining: 'V balíčku ti toľko kávy neostáva. Máš {remaining} g.',
  preBrewOverDoseWindow: 'Na tento brewer je to veľa kávy. Rozumné maximum je {max} g.',
  preBrewUnderDoseWindow: 'Na tento brewer je to málo kávy. Rozumné minimum je {min} g.',

  preBrewSubmit: 'Napíš mi recept',
  preBrewSubmitting: 'Píšem recept...',
  preBrewError: 'Recept sa nepodarilo napísať. Skús to prosím znova.',
  preBrewOffline: 'Si offline. Recept ti napíšem, keď budeš mať signál.',
  preBrewMissingMethod: 'Najprv vyber prípravu.',
} as const;
