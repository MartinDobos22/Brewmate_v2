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
  /**
   * The same count beside the step bar, where it is read as a figure rather
   * than as a sentence - the words are already directly underneath it.
   */
  brewModeStepCount: '{current}/{total}',
  brewModeStepProgressLabel: 'Ako ďaleko si vo varení',
  brewModeTargetWeight: 'Na váhe {grams} g',
  /** The unit beside the target on the scale chip, where the number is set alone. */
  brewModeScaleUnit: 'g na váhe',
  brewModeElapsed: 'Celkovo {time}',
  brewModeNoTimeStep: 'Bez času - pokračuj, keď to uvidíš',
  brewModeNextStep: 'Ďalej: {label}',
  /**
   * The same thing as `brewModeNextStep`, split because the pill under the
   * ring sets the word and the step in two different weights. One word rather
   * than half a sentence, so there is still nothing here a translator has to
   * assemble.
   */
  brewModeNextPrefix: 'Ďalej',
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
