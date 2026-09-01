/**
 * What is in the bag, as opposed to whether to buy it.
 *
 * The copy has one job the shape cannot do: say how much of this is read and
 * how much is guessed. A coffee estimated from a country alone and one
 * estimated from a full label look identical once both are five numbers, and
 * the difference between them is the difference between a reading and a guess.
 */
export const SK_COFFEE_TASTE = {
  coffeeTasteTitle: 'Ako bude chutiť',
  coffeeTasteUnknown:
    'Z tejto etikety sa chuť odhadnúť nedá. Doplň praženie, spracovanie alebo krajinu pôvodu a hneď ti poviem viac.',
  coffeeTasteEvidence: 'Odhadujem z toho, čo je na obale: {signals}.',
  coffeeTasteNoEvidence: 'Zatiaľ nemám z čoho vychádzať.',
  coffeeTasteRefining: 'Pozerám sa na etiketu bližšie...',
  coffeeTasteFromLabelOnly: 'Toto som spočítal z etikety sám, bez modelu.',

  coffeeSignalRoast: 'praženie',
  coffeeSignalProcess: 'spracovanie',
  coffeeSignalOrigin: 'pôvod',
  coffeeSignalAltitude: 'nadmorská výška',
  coffeeSignalVariety: 'odroda',
  coffeeSignalNotes: 'chuťové tóny',
  coffeeSignalModel: 'rozbor etikety',
} as const;
