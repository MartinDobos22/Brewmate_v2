/**
 * The shop scanner: "mám si ju kúpiť?", asked in front of a shelf.
 *
 * The one thing a brand-new user can do that pays off immediately - it needs
 * no inventory and no brewing history, only the questionnaire. So the copy
 * never asks for anything the person is not holding in their hand, and it says
 * out loud which parts of the answer rest on a guess.
 */
export const SK_SCANNER = {
  scanTitle: 'Poradím ti v obchode',
  scanIntro:
    'Nepotrebujem na to inventár ani históriu varení. Stačí to, čo je napísané na balíčku.',
  scanPhotoNote:
    'Fotku balíčka zatiaľ neviem prečítať sám, tak mi to prosím prepíš. Stačí to, čo vidíš - prázdne polia ničomu nevadia.',

  scanLabelTitle: 'Čo je na balíčku?',
  scanNameLabel: 'Názov kávy',
  scanNamePlaceholder: 'Napríklad: Sidamo',
  scanRoasterLabel: 'Pražiareň',
  scanOriginLabel: 'Krajina pôvodu',
  scanNotesLabel: 'Chuťové poznámky z balíčka',
  scanNotesPlaceholder: 'Napríklad: čokoláda, orech, pomaranč',
  scanNotesHelp: 'Oddeľ ich čiarkou.',
  scanRoastLabel: 'Praženie',
  scanRoastUnknown: 'Neviem',
  scanRoastDateLabel: 'Dní od praženia',
  scanRoastDateUnknown: 'Dátum praženia nevidím',
  scanRoastDateKnown: 'Viem, kedy bola upražená',
  scanSubmit: 'Čo si o nej myslíš?',

  scanVerdictTitle: 'Môj názor',
  scanVerdictFits: 'Podľa mňa ti sadne',
  scanVerdictFitsBody: 'Nič, čo som na nej videl, ti nejde proti srsti.',
  scanVerdictMixed: 'Niečo mi na nej nesedí',
  scanVerdictMixedBody: 'Kúpiť si ju môžeš, ale toto by som ti nezamlčal.',
  scanVerdictUnknown: 'Toto ti nepoviem',
  scanVerdictUnknownBody:
    'Z toho, čo som sa dozvedel, sa nedá seriózne povedať, či ti sadne. Radšej to priznám, než aby som hádal.',
  scanReasoningTitle: 'Prečo si to myslím',
  scanUncertaintyTitle: 'Čo som nevidel',

  scanPointRoastMatches: 'Praženie sedí s tým, čo ti chutí.',
  scanPointRoastNear: 'Praženie je blízko toho, čo ti chutí.',
  scanPointRoastDiffers: 'Praženie je iné, než aké ti zvykne sadnúť.',
  scanPointFlavorLiked: 'Chuťové poznámky sedia s tým, čo máš rád.',
  scanPointFlavorDisliked: 'Sú tam chute, ktoré ti podľa mňa nesadli.',
  scanPointTooFresh: 'Je čerstvo upražená - pár dní ju nechaj odležať.',
  scanPointRested: 'Je akurát odležaná.',
  scanPointOld: 'Od praženia ubehlo dosť času, chute už môžu byť ploché.',

  scanReasonNoRoast: 'Praženie som sa nedozvedel.',
  scanReasonNoNotes: 'Chuťové poznámky som nemal.',
  scanReasonNoRoastDate: 'Dátum praženia som nemal.',
  scanReasonNoProfile: 'O tvojej chuti zatiaľ viem primálo.',

  scanOutcomeTitle: 'Kúpil si ju?',
  scanOutcomeBody: 'Podľa toho sa naučím, kedy ti moje rady sadli a kedy nie.',
  scanOutcomeBought: 'Áno, kúpil',
  scanOutcomeSkipped: 'Nie, nechal som ju tam',
  scanSavedTitle: 'Zapísané',
  scanSavedBody: 'Kávu som ti pridal do inventára aj s tým, čo o nej viem.',
  scanSkippedTitle: 'Dobre',
  scanSkippedBody: 'Zapamätal som si, čo som ti radil. Nabudúce to bude presnejšie.',
  scanDone: 'Hotovo',
  scanAgain: 'Pozrieť ďalšiu',
  scanError: 'Nepodarilo sa to uložiť. Skús to prosím znova.',
} as const;
