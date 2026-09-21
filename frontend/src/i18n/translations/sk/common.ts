/** Shared copy: actions, states and labels reused across screens. */
export const SK_COMMON = {
  appName: 'Brewmate',
  actionRetry: 'Skúsiť znova',
  actionCancel: 'Zrušiť',
  actionConfirm: 'Potvrdiť',
  actionClose: 'Zavrieť',
  actionSave: 'Uložiť',
  actionBack: 'Späť',
  actionSkip: 'Preskočiť',
  actionContinue: 'Pokračovať',
  actionAdd: 'Pridať',
  actionEdit: 'Upraviť',
  actionDone: 'Hotovo',
  unitMillilitres: 'ml',
  unitMillimetres: 'mm',
  listSeparator: ' · ',
  stepCount: 'Krok {current} z {total}',
  /*
   * The same count where it shares a line with something else.
   *
   * Set in mono beside the name of the step, so the digits do not shift as the
   * flow moves. The long form stays: it is what a screen reader is given,
   * because "dva lomka osem" is not how anybody says it out loud.
   */
  stepCountShort: '{current}/{total}',
  stepProgressLabel: 'Ako ďaleko si',
  stateLoading: 'Načítava sa…',
  stateEmptyTitle: 'Zatiaľ nič',
  stateEmptyBody: 'Keď sem niečo pribudne, uvidíš to tu.',
  stateErrorTitle: 'Niečo sa pokazilo',
  stateErrorBody: 'Skús to prosím znova o chvíľu.',
  unitGrams: 'g',
  unitCurrency: 'USD',
  unitSeconds: 's',
  unitCelsius: '°C',
  unitDays: 'dní',

  /*
   * The labels under the three figures a recipe is made of.
   *
   * Shared rather than written per screen: the home block, the conversation's
   * header and the timeline all print the same dose, water and ratio, and
   * three copies of three words is three screens that eventually disagree
   * about what to call the ratio.
   */
  figureDose: 'g dávka',
  figureWater: 'g voda',
  figureRatio: 'pomer',
  ratioSeparator: ':',
  decrease: 'Znížiť',
  increase: 'Zvýšiť',
} as const;
