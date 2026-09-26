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
  preBrewSourceIntro:
    'Odfoť balíček, vyber jeho fotku z galérie, alebo niečo, čo už máš v skrinke.',
  preBrewSourcePhoto: 'Odfotím balíček',
  preBrewSourcePhotoCaption: 'Z etikety prečítam, čo sa dá, a zapíšem ti ju do skrinky.',
  preBrewSourceInventory: 'Mám ju v skrinke',
  preBrewSourceInventoryCaption: 'Vyber si z toho, čo máš doma.',
  preBrewSourceLibrary: 'Vyberiem z galérie',
  preBrewSourceLibraryCaption: 'Fotku balíčka už máš v telefóne.',
  preBrewSourceManual: 'Prepíšem ručne',
  preBrewSourceManualCaption: 'Vyplníš, čo vidíš na etikete.',
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

  /*
   * The brewer, as one line that opens into the catalogue.
   *
   * The search placeholder names a brand and a family rather than giving an
   * instruction, because that is what somebody types: half the name they
   * remembered, or the kind of coffee they want out of it.
   */
  preBrewMethodSection: 'Príprava',
  preBrewMethodLabel: 'Metóda',
  preBrewMethodPlaceholder: 'Vyber, v čom dnes varíš',
  preBrewMethodHint: 'Vyber, v čom dnes varíš.',
  preBrewMethodSheetTitle: 'V čom dnes varíš?',
  preBrewMethodSearchLabel: 'Hľadaj',
  preBrewMethodSearchPlaceholder: 'Napríklad: v60, prelievaná, aeropress',
  preBrewMethodSearchEmpty: 'Nič také tu nemám. Skús to napísať inak.',
  preBrewMethodEmpty: 'Katalóg metód sa nepodarilo načítať. Skús to o chvíľu znova.',
  /** Over the cards, which are only the methods the cupboard vouches for. */
  preBrewMethodOwnedHint: 'len to, na čo máš vybavenie',
  /**
   * The way to the rest of the catalogue, under the cards.
   *
   * Every method stays reachable. Hiding the ones nothing in the cupboard
   * points at reads as helpful and behaves as a trap: a cupboard nobody has
   * filled in is indistinguishable from an empty one.
   */
  preBrewMethodMore: 'Iná príprava',

  /*
   * The recipe this pair already has.
   *
   * Two titles because they are two different claims: a pinned recipe is the
   * one this person decided was right, and the latest one is merely the most
   * recent thing the app wrote. Calling the second "overený" would be the
   * screen vouching for something nobody vouched for.
   *
   * The history line never says "uvaril si ju takto" about a recipe that was
   * written and walked away from - being told about a morning that did not
   * happen is how an app loses the benefit of the doubt on everything else it
   * says.
   */
  preBrewPreviousPinnedTitle: 'Tvoj pripnutý recept',
  preBrewPreviousTitle: 'Recept, ktorý už máš',
  preBrewPreviousBrewed: 'Takto si ju varil {count}× - naposledy {date}.',
  preBrewPreviousNeverBrewed:
    'Tento recept ti už appka napísala, ale zatiaľ si podľa neho nevaril.',
  preBrewPreviousBrewAgain: 'Uvariť znova',
  preBrewPreviousTimeline: 'Ako sa k týmto číslam došlo',

  preBrewConstraintsTitle: 'Dnes nemám všetko',
  preBrewConstraintsClosed: 'Zaškrtni, čo ti dnes chýba - recept podľa toho prepíšem.',
  preBrewConstraintsHint: 'Otvor a zaškrtni, čo ti dnes chýba.',
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
  preBrewWaterTypeLabel: 'Typ vody',
  preBrewWaterHint: 'Predvyplnené z profilu. Pre toto varenie to môžeš zmeniť.',

  preBrewImportRecipe: 'Mám recept odinakiaľ',
  preBrewStartDialIn: 'Nová káva - poď ju vyladiť',
  preBrewAmountsSection: 'Dávka a pomer',
  preBrewDoseLabel: 'Káva',
  preBrewWaterLabel: 'Voda',
  preBrewYieldLabel: 'Výtlačok',
  preBrewRatioLabel: 'Pomer',
  preBrewAmountsHint: 'Zmeň ktorékoľvek číslo a zvyšné sa dopočítajú.',
  /** The same thing at the size of a caption, beside the card's own heading. */
  preBrewAmountsHeaderHint: 'zmeň jedno, dopočítam zvyšok',
  /**
   * What the screen says where there is no bag behind the brew.
   *
   * New copy, and the point of the whole no-bag branch: brewing is never
   * blocked on a cupboard entry, and saying so plainly is what stops the
   * dashed row above reading as an error.
   */
  preBrewNoCoffeeNote:
    'Variť môžeš aj tak. Recept ti napíšem z toho, v čom variš - kávu si zapíšeš, keď budeš chcieť.',
  /** The foot bar's second line where no bag was chosen. */
  preBrewFootNoCoffee: 'káva nezapísaná',
  /*
   * Which number moves which, said outright.
   *
   * The calculator is bidirectional and the direction is not guessable from
   * looking at it: a dose keeps the ratio and moves the water, a water weight
   * keeps the dose and moves the ratio. Somebody pressing plus on the water
   * and watching the ratio change instead has every reason to think the
   * control is broken.
   */
  preBrewAmountsTypeHint:
    'Do čísel sa dá aj ťuknúť a prepísať ich. Dávka posúva vodu pri rovnakom pomere, voda posúva pomer.',
  preBrewSuggestionNote: 'Toto som ti predvyplnil ja. Posledné slovo máš ty.',
  preBrewSuggestionReason: 'Vychádzam zo stredu pomeru pre {method} a z toho, čo drží tvoj brewer.',

  preBrewOverCapacity: 'Toľko vody sa ti do brewera nezmestí. Zmestí sa zhruba {capacity} g.',
  preBrewOverRemaining: 'V balíčku ti toľko kávy neostáva. Máš {remaining} g.',
  preBrewOverDoseWindow: 'Na tento brewer je to veľa kávy. Rozumné maximum je {max} g.',
  preBrewUnderDoseWindow: 'Na tento brewer je to málo kávy. Rozumné minimum je {min} g.',

  preBrewSubmit: 'Napíš mi recept',
  preBrewSubmitting: 'Píšem recept...',
  /*
   * What a failure prints under the sentence explaining it.
   *
   * Not for the person to understand - the sentence above it is what they read
   * - but for the one case where nothing else helps: a code says which of nine
   * things refused, and a request id finds the exact line in the server log.
   * Without them a bug report is a photograph of a red rectangle.
   */
  preBrewErrorReference: 'Kód {code} · požiadavka {requestId}',
  preBrewErrorCode: 'Kód {code}',
  preBrewOffline: 'Si offline. Recept ti napíšem, keď budeš mať signál.',
  preBrewMissingMethod: 'Najprv vyber prípravu.',

  preBrewGrindSection: 'Kde začať s mlynčekom',
  preBrewGrindIntroPublished:
    'Rozsah je publikovaný pre tento mlynček; v ňom ťa posúvam podľa toho, čo je na balíčku. Je to štart, nie výsledok.',
  preBrewGrindIntroWindow:
    'Pre tento mlynček a túto prípravu nikto rozsah nezverejnil, tak vychádzam z bežného okna pre tento typ prípravy a z krivky mlynčeka. Hrubší odhad — po prvej šálke ho doladíme.',
  /*
   * Only drawn where there are two. The hint asks the question in the words
   * somebody would use standing over the machines - which one is turning now -
   * rather than naming a setting, and each option says which kind of answer it
   * can give, because that is the real difference between them.
   */
  preBrewGrindPickerHint: 'Na ktorom melieš túto?',
  preBrewGrindPickerTitle: 'Na ktorom mlynčeku melieš?',
  preBrewGrindPickerEmpty: 'Zatiaľ nemám zapísaný žiadny mlynček',
  preBrewGrindPickerNumber: 'Poznám jeho stupnicu - poviem ti číslo aj o koľko klikov hýbať.',
  preBrewGrindPickerWords: 'Tento v katalógu nemám, takže hrubosť poviem len slovami.',
  /*
   * The way out of "nemám žiadny zapísaný", in the same list as the answers.
   *
   * The note says what picking one buys, because that is the reason to bother:
   * a catalogued grinder is the difference between "stredne jemné" and a
   * number on the collar in front of you.
   */
  preBrewGrindPickerFromCatalogue: 'Vybrať mlynček z katalógu',
  preBrewGrindPickerFromCatalogueNote:
    'Zapíšem ti ho medzi vybavenie a poviem ti rovno číslo na jeho stupnici.',
  preBrewGrindPickerCatalogueTitle: 'Katalóg mlynčekov',
  preBrewGrindUnnamed: 'Mlynček bez názvu',

  preBrewGrindOnCollar: 'Na mlynčeku {grinder}',
  preBrewGrindBand: '{target} (rozumné rozpätie {min} až {max})',
  preBrewGrindWords: 'Hrubosť',
  preBrewGrindStep: 'Jedna úprava, ktorú ochutnáš',
  preBrewGrindStepValue: 'posuň o {settings} na stupnici (jeden krok je asi {microns} µm)',
  preBrewGrindReasons: 'Prečo práve sem',
  preBrewGrindNoReasons: 'O tejto káve neviem nič, takže je to stred rozsahu pre túto prípravu.',
  preBrewGrindShiftEntry: '{fact} → {direction}',
  preBrewGrindShiftRoast: 'praženie',
  preBrewGrindShiftProcess: 'spracovanie',
  preBrewGrindShiftRest: 'čas od upraženia',
  preBrewGrindFiner: 'jemnejšie',
  preBrewGrindCoarser: 'hrubšie',
  preBrewGrindNoCurve:
    'Tvoj mlynček nemám v katalógu s mikrónovou krivkou, tak ti viem povedať len hrubosť slovom.',
  preBrewGrindNoGrinder:
    'Zapíš si mlynček medzi vybavenie a poviem ti rovno číslo na jeho stupnici.',
  preBrewGrindEstimated: 'Krivka toho mlynčeka je odhad z katalógu, nie meranie sitom.',

  grindDescriptorExtraFine: 'veľmi jemné',
  grindDescriptorFine: 'jemné',
  grindDescriptorMediumFine: 'stredne jemné',
  grindDescriptorMedium: 'stredné',
  grindDescriptorMediumCoarse: 'stredne hrubé',
  grindDescriptorCoarse: 'hrubé',
} as const;
