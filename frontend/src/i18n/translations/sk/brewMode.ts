/**
 * The screen somebody looks at with wet hands from half a metre away.
 *
 * Everything here is short on purpose. A sentence that needs reading twice is
 * a sentence read while the water is going in the wrong place, and the words
 * that matter - the step, the target weight, the number counting down - are
 * the ones that carry the screen rather than the ones explaining it.
 */
export const SK_BREW_MODE = {
  brewModeTitle: 'Varenie',
  brewModeReadyTitle: 'Pripravený?',
  brewModeReadyBody: 'Naváž kávu, priprav vodu a keď to spustíš, už len lej.',
  brewModeStart: 'Spustiť',
  brewModePause: 'Pauza',
  brewModeResume: 'Pokračovať',
  brewModeSkip: 'Ďalší krok',
  brewModeRestart: 'Od začiatku',
  brewModeFinish: 'Hotovo',
  brewModeLeave: 'Ukončiť',

  brewModeStepOf: 'Krok {current} z {total}',
  brewModeTargetWeight: 'Na váhe {grams} g',
  brewModeElapsed: 'Celkovo {time}',
  brewModeNoTimeStep: 'Bez času - pokračuj, keď to uvidíš',
  brewModeNextStep: 'Ďalej: {label}',
  brewModeLastStep: 'Posledný krok',
  brewModeOvertime: 'Máš to o {seconds} s dlhšie',

  brewModeSimpleTitle: 'Stopky',
  brewModeSimpleBody:
    'Táto príprava nemá rozpis nalievania. Spusti stopky a zapíš, ako to dopadlo.',
  brewModeTargetTime: 'Cieľový čas {time}',
  brewModeNoTargetTime: 'Bez cieľového času',

  brewModeGrind: 'Mletie',
  brewModeTemperature: 'Teplota',
  brewModeDose: 'Dávka',
  brewModeWater: 'Voda',
  brewModePreInfusion: 'Predsmáčanie',

  brewModeDoneTitle: 'Uvarené',
  brewModeDoneBody: 'Ochutnaj a povedz mi, aké to bolo. Práve z toho sa učím najviac.',
  brewModeDoneChat: 'Poviem ti, aké to bolo',
  brewModeDoneLater: 'Teraz nie',

  brewModeQueuedTitle: 'Zapíšem to, keď bude signál',
  brewModeQueuedBody: 'Varenie mám uložené v telefóne a odošlem ho, len čo sa pripojíš.',

  brewModeMissingRecipe: 'Tento recept sa nepodarilo načítať.',
} as const;
