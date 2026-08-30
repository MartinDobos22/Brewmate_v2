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
  homeStartProgressLabel: 'Priebeh prvých krokov',
  homeStartCountSeparator: ' / ',

  homeStartStepTaste: 'Povedz mi, čo ti chutí',
  homeStartStepTasteNote: 'Desať otázok, asi tri minúty.',
  homeStartStepCoffee: 'Pridaj kávu alebo naskenuj balíček v obchode',
  homeStartStepCoffeeNote: 'Stačí jedno z toho.',
  homeStartStepBrew: 'Uvar prvú kávu',
  homeStartStepBrewNote: 'Nemusíš ju mať zapísanú v inventári.',
  homeStartStepDone: 'Hotovo',
  homeStartHide: 'Skryť tieto kroky',

  homeScanBody:
    'Poviem ti, či ti tá káva sadne. Netreba na to nič, čo by si už nemal - stačí dotazník.',
} as const;
