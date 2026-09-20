/**
 * The home screen of somebody who has just installed the app.
 *
 * A dashboard with nothing on it is the worst first impression a product can
 * make, so the empty home is not a dashboard: it is three things worth doing,
 * in the order they pay off, and two of them work before the app knows
 * anything at all.
 */
export const SK_HOME = {
  homeStartTitle: 'Začni tu',
  homeStartBody: 'Tri kroky a budem ti vedieť poradiť ako niekto, kto ťa pozná.',
  homeStartCountSeparator: ' / ',

  homeStartStepTaste: 'Povedz mi, čo ti chutí',
  homeStartStepTasteNote: 'Desať otázok, asi tri minúty.',
  homeStartStepCoffee: 'Pridaj kávu alebo naskenuj balíček v obchode',
  homeStartStepCoffeeNote: 'Stačí jedno z toho.',
  homeStartStepBrew: 'Uvar prvú kávu',
  homeStartStepBrewNote: 'Nemusíš ju mať zapísanú v inventári.',
  /*
   * The same two actions, at the size the espresso block draws them.
   *
   * "Poďme na to" opens whichever step is next rather than scrolling to a
   * list already on screen, so it says something the rows do not. "Skryť" is
   * short because it sits beside a button that takes the width - and refusing
   * a checklist should not need a sentence.
   */
  homeStartBegin: 'Poďme na to',
  homeStartHideShort: 'Skryť',
} as const;
