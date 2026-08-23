/**
 * Water and the saved combinations of gear.
 *
 * The water copy carries an explanation on purpose: it is the one answer here
 * where a user has no idea why they are being asked, and the honest reason -
 * water is most of the cup - is short enough to say out loud.
 */
export const SK_WATER_AND_SETS = {
  setupWaterTitle: 'Akú vodu používaš?',
  setupWaterBody:
    'Voda je vyše devätnásť dvadsatín hotovej kávy. Tvrdá voda zráža kyslosť a robí kávu plochou, príliš mäkká z nej spraví prázdny nápoj. Preto sa pýtam.',
  setupWaterTap: 'Z kohútika',
  setupWaterTapNote: 'Najbežnejšie. Podľa mesta môže byť dosť tvrdá.',
  setupWaterBottled: 'Balená',
  setupWaterBottledNote: 'Zloženie máš napísané na etikete.',
  setupWaterFiltered: 'Filtrovaná',
  setupWaterFilteredNote: 'Kanvica s filtrom alebo filter na kohútiku.',
  setupWaterRemineralized: 'Remineralizovaná',
  setupWaterRemineralizedNote: 'Destilovaná alebo osmotická voda s pridanými minerálmi.',
  setupWaterUnknown: 'Neviem',
  setupWaterUnknownNote: 'Úplne v poriadku. Budem s tým počítať.',

  setupSetsTitle: 'Zostavy vybavenia',
  setupSetsBody:
    'Zostava je pomenovaná kombinácia toho, čo už máš: doma iný mlynček než na chate. Pred varením ju prepneš jedným ťuknutím.',
  setupSetsNothingToCombine:
    'Zostavu má zmysel založiť, až keď máš zapísané aspoň jedno vybavenie.',
  setupSetsNameLabel: 'Názov zostavy',
  setupSetsNamePlaceholder: 'Napríklad Domov',
  setupSetsItemsLabel: 'Čo do nej patrí',
  setupSetsDefaultLabel: 'Toto je moja predvolená zostava',
  setupSetsConstraintsLabel: 'Čo tam zvyčajne chýba',
  setupSetsAddAction: 'Uložiť zostavu',
  setupSetsEmptyNotice: 'Zatiaľ nemáš žiadnu zostavu.',
  setupSetsDefaultBadge: 'Predvolená',
  setupSetsMakeDefault: 'Nastaviť ako predvolenú',
  setupSetsErrorNameRequired: 'Pomenuj zostavu.',
  setupSetsErrorItemsRequired: 'Vyber aspoň jeden kus vybavenia.',
  setupSetsSuggestionHome: 'Domov',
  setupSetsSuggestionCabin: 'Chata',
  setupSetsSuggestionWork: 'Práca',
  setupSetsSuggestionFriend: 'U kamaráta',

  constraintNoTemperatureControl: 'Bez regulácie teploty',
  constraintNoScale: 'Bez váhy',
  constraintNoGrinder: 'Bez mlynčeka',
  constraintFixedGrindSetting: 'Mletie sa nedá meniť',
  constraintBorrowedEquipment: 'Cudzie vybavenie',
  constraintUnknownWater: 'Neznáma voda',
  constraintLimitedTime: 'Málo času',

  brewSetSwitcherTitle: 'Kde dnes varíš?',
  brewSetSwitcherEmpty: 'Zostavy si vytvoríš v profile.',

  brewAvailableTitle: 'Čo vieš uvariť',
  brewAvailableBody: 'Ponúkam len metódy, na ktoré máš zapísané vybavenie.',
  brewAvailableEmpty: 'Zatiaľ nemám zapísané žiadne vybavenie, tak ti nemám čo ponúknuť.',
  brewAvailableAction: 'Zapísať vybavenie',
} as const;
