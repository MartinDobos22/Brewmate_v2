/**
 * The cupboard.
 *
 * An empty one is not a failure state: most people who install a coffee app
 * own coffee and have never written any of it down. So the empty screen offers
 * the two ways in, and a third for the person who is standing in a shop with
 * nothing at home at all.
 */
export const SK_INVENTORY = {
  inventoryTitle: 'Tvoja káva',
  inventoryEmptyTitle: 'Zatiaľ tu nemáš žiadnu kávu',
  inventoryEmptyBody:
    'Zapíš si balíček, ktorý máš doma. Bude z toho história, ktorá mi časom povie, čo ti chutí.',
  inventoryAddScan: 'Naskenovať balíček',
  inventoryAddManual: 'Zadať ručne',
  inventoryNoCoffeeYet: 'Ešte kávu nemám - pomôž mi vybrať',
  inventoryAddTitle: 'Pridať kávu',
  inventoryAddSubmit: 'Pridať do inventára',
  inventoryAddError: 'Kávu sa nepodarilo pridať. Skús to prosím znova.',
  inventoryUnnamedCoffee: 'Káva bez názvu',
  inventoryOpenGrinders: 'Katalóg mlynčekov',
  inventoryBagUnknownDetails: 'Bez ďalších údajov',
} as const;
