/**
 * The calibration brew.
 *
 * The first paragraph does the real work here: somebody who thinks they are
 * being examined brews carefully and describes the cup the way they think
 * they should. The whole value of this step depends on them not doing that.
 */
export const SK_CALIBRATION = {
  calibrationTitle: 'Uvarme spolu jednu kávu',
  calibrationIntro:
    'Nie je to test a nedá sa to pokaziť. Navrhnem ti jeden jednoduchý recept na tvoje vybavenie, ty ho uvaríš a potom mi vlastnými slovami povieš, aké to bolo.',
  calibrationWhy:
    'Podľa toho, ako o káve hovoríš, sa naladím na tvoj slovník. Keď povieš „silná“, budem vedieť, či myslíš horkú alebo sýtu.',
  calibrationSkip: 'Preskočiť, uvarím si to neskôr',

  calibrationRecipeTitle: 'Referenčný recept',
  calibrationRationale:
    'Referenčné varenie z úvodného nastavenia. Zámerne jednoduché, aby sa dalo zopakovať.',
  calibrationBrewedAction: 'Uvaril som, ideme na to',

  calibrationChatTitle: 'Aké to bolo?',
  calibrationChatBody:
    'Napíš to tak, ako by si to povedal kamarátovi. Krátka veta stačí. Nemusíš používať odborné slová.',
  calibrationChatPlaceholder: 'Napríklad: bola dosť kyslá a tenká, chýbala jej sladkosť',
  calibrationChatSend: 'Poslať',
  calibrationChatExample: 'Napríklad: horká, silná, príliš vodová, sladká, ovocná',

  calibrationUnderstoodTitle: 'Rozumiem tomu takto',
  calibrationNotUnderstood:
    'Z toho som veľa nevyčítal. Skús doplniť, či bola skôr kyslá, horká, slabá alebo sladká.',
  calibrationSavedTitle: 'Zapísané',
  calibrationSavedBody: 'Zapamätal som si to a podľa toho ti budem ďalšie recepty upravovať.',
  calibrationSaveError: 'Nepodarilo sa to zapísať. Skús to prosím znova.',

  calibrationNoEquipmentTitle: 'Zatiaľ nemám z čoho vychádzať',
  calibrationNoEquipmentBody:
    'Recept ti navrhnem, keď budem vedieť, v čom pripravuješ kávu. Tento krok pokojne preskoč a vráť sa k nemu neskôr.',

  readingAcidityHigh: 'Bola ti príliš kyslá',
  readingAcidityLow: 'Chýbala ti kyslosť',
  readingBitternessHigh: 'Bola ti horká',
  readingBitternessLow: 'Horkosť ti nevadila',
  readingBodyHigh: 'Prišla ti hustá',
  readingBodyLow: 'Prišla ti tenká alebo vodová',
  readingSweetnessHigh: 'Cítil si sladkosť',
  readingSweetnessLow: 'Chýbala ti sladkosť',
  readingIntensityHigh: 'Bola ti silná',
  readingIntensityLow: 'Bola ti slabá',
  readingBalanced: 'Bola vyvážená',
} as const;
