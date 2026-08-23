/**
 * Setting up the cupboard: the grinder, the brewers and the two accessories
 * that change what the app may recommend.
 *
 * Nothing here is mandatory. A user without a scale still gets recipes; they
 * just get recipes that do not assume one.
 */
export const SK_EQUIPMENT_SETUP = {
  setupGrinderTitle: 'Na čom melieš?',
  setupGrinderBody:
    'Podľa mlynčeka viem prepočítať hrubosť mletia na tvoju stupnicu namiesto toho, aby som ti hovoril „stredne hrubo“.',
  setupGrinderSelected: 'Vybraný mlynček',
  setupGrinderChange: 'Vybrať iný',
  setupGrinderNoneAction: 'Mlynček nemám',
  setupGrinderNoneNote:
    'Bez mlynčeka budem počítať s mletou kávou a hrubosť mletia ti radiť nebudem.',

  setupBrewersTitle: 'V čom pripravuješ kávu?',
  setupBrewersBody:
    'Vyber všetko, čo naozaj máš doma. Ponúkať ti budem len tie metódy, na ktoré máš vybavenie.',
  setupBrewersSelectedCount: 'Vybrané metódy',
  setupBrewersEmptyNotice: 'Zatiaľ si nevybral žiadnu metódu.',
  setupBrewersDetailAction: 'Doplniť podrobnosti',
  setupBrewersLoading: 'Načítavam metódy…',
  setupBrewersError: 'Zoznam metód sa nenačítal.',

  setupBrewerDetailTitle: 'Podrobnosti o vybavení',
  setupBrewerCapacityLabel: 'Objem (ml)',
  setupBrewerCapacityHelp: 'Koľko sa doň zmestí naraz. Podľa toho ti neponúknem dávku navyše.',
  setupBrewerDoseMinLabel: 'Najmenšia dávka (g)',
  setupBrewerDoseMaxLabel: 'Najväčšia dávka (g)',
  setupBrewerDoseHelp: 'Ak to nevieš, nechaj prázdne. Radšej nič než vymyslené číslo.',
  setupBrewerBasketLabel: 'Priemer sitka (mm)',
  setupBrewerBasketHelp: 'Pri espresse rozhoduje sitko o tom, akú dávku má zmysel navážiť.',
  setupBrewerDetailSave: 'Uložiť podrobnosti',
  setupBrewerErrorNumber: 'Zadaj číslo.',
  setupBrewerErrorDoseRange: 'Najmenšia dávka musí byť menšia ako najväčšia.',

  setupGearTitle: 'Váha a kanvica',
  setupGearBody:
    'Toto sú dve veci, ktoré najviac menia to, ako presne ti viem poradiť. Odpovedz podľa pravdy, nie podľa toho, čo by bolo „správne“.',
  setupGearScaleQuestion: 'Máš kuchynskú váhu?',
  setupGearScaleYes: 'Mám váhu',
  setupGearScaleNo: 'Nemám',
  setupGearScaleNote: 'Bez váhy ti budem dávku hovoriť v lyžiciach a s väčšou toleranciou.',
  setupGearKettleQuestion: 'Máš kanvicu s reguláciou teploty?',
  setupGearKettleYes: 'Áno, teplotu si viem nastaviť',
  setupGearKettleNo: 'Nie, len obyčajnú',
  setupGearKettleNote:
    'Bez regulácie ti poradím, koľko nechať vodu odstáť, namiesto presných stupňov.',

  methodCategoryPourOver: 'Prelievané',
  methodCategoryImmersion: 'Lúhované',
  methodCategoryEspresso: 'Espresso',
  methodCategoryCold: 'Studená káva',
  methodCategoryStovetop: 'Na sporáku',
  methodCategoryBatch: 'Prekvapkávač',

  setupErrorSaveFailed: 'Nepodarilo sa to uložiť. Skús to prosím znova.',
} as const;
