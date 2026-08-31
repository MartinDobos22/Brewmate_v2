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

  scanModeVerdictTitle: 'Stojím v obchode a rozmýšľam',
  scanModeVerdictBody: 'Poviem ti, či ti tá káva podľa mňa sadne - a prečo si to myslím.',
  scanModeInventoryTitle: 'Túto kávu už mám',
  scanModeInventoryBody: 'Zapíšem ti ju do inventára aj s tým, čo je na balíčku.',

  scanPhotoTitle: 'Odfoť balíček',
  scanPhotoBody:
    'Prečítam z etikety, čo sa dá. Čo neprečítam, nechám prázdne - nikdy si nič nevymyslím.',
  scanPhotoTake: 'Odfotiť',
  scanPhotoTakeCaption: 'Etiketu prepíšem za teba.',
  scanPhotoChoose: 'Vybrať z galérie',
  scanPhotoSkip: 'Zadám to ručne',
  scanPhotoSkipCaption: 'Keď je etiketa nečitateľná alebo nechceš fotiť.',
  scanPhotoReading: 'Čítam etiketu...',
  scanPhotoFailed:
    'Fotku sa mi nepodarilo poslať alebo prečítať. Nevadí - prepíš mi z balíčka, čo vidíš.',

  /*
   * A refused photograph, and what to do about it.
   *
   * The heading says what happened and never why it is somebody's fault: a
   * shop is badly lit, a bag is shiny, and a phone held one-handed over a
   * shelf moves. Each reason below is an instruction rather than a diagnosis,
   * because the only thing anybody can do with this screen is take another
   * photograph - and "rozmazané" tells them nothing they did not already
   * suspect, where "chyť telefón oboma rukami" does.
   */
  scanPhotoRefused: 'Z tejto fotky sa mi nepodarilo prečítať nič.',
  scanPhotoRefusedHint: 'Skús to ešte raz - alebo mi to rovno prepíš z balíčka.',
  scanPhotoIssueNoText: 'Nenašiel som na nej žiadny text. Namier na etiketu zblízka.',
  scanPhotoIssueUnsharp: 'Písmo je rozmazané. Chyť telefón oboma rukami a počkaj, kým zaostrí.',
  scanPhotoIssueTooDark: 'Je na to primálo svetla. Postav sa bližšie k svetlu.',
  scanPhotoIssueTooBright: 'Presvetlilo to odlesk. Nakloň balíček, nech sa svetlo neodráža.',
  scanPhotoRetake: 'Odfotiť znova',

  scanLabelCheckUncertain:
    'Toto som vyčítal z fotky. Zvýraznené polia som čítal na hranici čitateľnosti - mrkni na ne, prosím.',
  scanLabelTypeItIn: 'Stačí to, čo vidíš na balíčku. Prázdne polia ničomu nevadia.',
  scanFieldUncertain: 'Toto som čítal ťažko, over to prosím.',
  scanRoastLabelUncertain: 'Praženie (čítal som ho ťažko)',
  scanRoastDateUncertain: 'Dátum praženia som čítal ťažko, over ho prosím.',

  scanDetailTitle: 'Ďalšie údaje z balíčka',
  scanRegionLabel: 'Región',
  scanFarmLabel: 'Farma',
  scanVarietyLabel: 'Odroda',
  scanProcessLabel: 'Spracovanie',
  scanProcessPlaceholder: 'Napríklad: washed, natural',
  scanAltitudeLabel: 'Nadmorská výška (m)',
  scanWeightLabel: 'Hmotnosť balíčka (g)',
  scanWeightHelp: 'Podľa toho ti počítam, koľko ti kávy ostáva.',

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
  scanVerdictWaiting: 'Rozmýšľam nad ňou...',
  scanVerdictFromHistory: 'Túto kávu som ti už raz hodnotil - hovorím ti to isté, čo vtedy.',
  scanVerdictFromHistoryOn: 'Túto kávu som ti hodnotil {date} - hovorím ti to isté, čo vtedy.',
  scanVerdictOffline:
    'Nedostal som sa teraz k tomu, aby som to premyslel poriadne. Toto je to, čo viem povedať sám, offline.',
  scanVerdictLocalNotice:
    'Napísali to tri jednoduché pravidlá v telefóne, nie ja celý. Keď budeš mať signál, spýtaj sa ma znova.',
  scanReasoningShow: 'Prečo si to myslím',
  scanReasoningHide: 'Skryť dôvody',
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
  scanAddedTitle: 'Pridané',
  scanAddedBody: 'Kávu máš v inventári. Odteraz ti k nej viem odkladať recepty aj varenia.',

  scanHistoryTitle: 'Čo som ti už hodnotil',
  scanHistoryBody: 'Aby som tú istú kávu neposudzoval dvakrát inak.',
  scanHistoryBought: 'Kúpil si ju',
  scanHistoryLeft: 'Nechal si ju tam',
  scanHistoryUndecided: 'Nepovedal si mi, ako to dopadlo',

  scanDone: 'Hotovo',
  scanAgain: 'Pozrieť ďalšiu',
  scanError: 'Nepodarilo sa to uložiť. Skús to prosím znova.',
} as const;
