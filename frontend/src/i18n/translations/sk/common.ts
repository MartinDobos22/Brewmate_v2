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
  ratioSeparator: ':',
  decrease: 'Znížiť',
  increase: 'Zvýšiť',
} as const;
