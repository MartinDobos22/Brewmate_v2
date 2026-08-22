/**
 * The grinder catalogue: searching it, reading an entry, and adding the one
 * that is missing.
 *
 * The precision lines are the important copy here. A micron figure looks like
 * a measurement whatever it is, so the app says out loud where each one came
 * from - and says it in the list, not in a settings screen nobody opens.
 */
export const SK_GRINDERS = {
  grinderCatalogTitle: 'Katalóg mlynčekov',
  grinderCatalogSubtitle: 'Nájdi svoj mlynček alebo si pridaj vlastný.',

  grinderSearchLabel: 'Hľadanie',
  grinderSearchPlaceholder: 'Značka alebo model',

  grinderFilterAll: 'Všetky',
  grinderFilterEspresso: 'Espresso',
  grinderFilterFilter: 'Filter',
  grinderFilterBoth: 'Espresso aj filter',

  grinderUnitClicks: 'kliky',
  grinderUnitNumbers: 'čísla',
  grinderUnitMicrons: 'mikróny',
  grinderStepless: 'plynulé',
  grinderStepLabel: 'krok',

  grinderPrecisionMeasured: 'Kalibrácia overená meraním',
  grinderPrecisionEstimated: 'Mikróny sú len orientačné',
  grinderPrecisionMissing: 'Bez kalibrácie – prepočty budú menej presné',
  grinderOwnEntry: 'Pridal si ho ty',

  grinderLoadingLabel: 'Načítavam katalóg…',
  grinderErrorTitle: 'Katalóg sa nenačítal',
  grinderErrorBody: 'Skús to prosím znova o chvíľu.',
  grinderNoResultsTitle: 'Nič sa nenašlo',
  grinderNoResultsBody:
    'Skús inú značku alebo model. Ak tvoj mlynček v katalógu nie je, pridaj si ho.',
  grinderEmptyTitle: 'Katalóg je prázdny',
  grinderEmptyBody: 'Zatiaľ tu nie je žiadny mlynček. Pridaj si ten svoj.',
  grinderNotFoundAction: 'Nenašiel som svoj mlynček',

  grinderAddTitle: 'Pridať vlastný mlynček',
  grinderAddBrandLabel: 'Značka',
  grinderAddBrandPlaceholder: 'Napríklad Comandante',
  grinderAddModelLabel: 'Model',
  grinderAddModelPlaceholder: 'Napríklad C40 MK4',
  grinderAddUnitTypeLabel: 'Stupnica na mlynčeku',
  grinderAddMinLabel: 'Najjemnejšie nastavenie',
  grinderAddMaxLabel: 'Najhrubšie nastavenie',
  grinderAddStepLabel: 'Veľkosť kroku',
  grinderAddStepHelp: 'Nula znamená plynulé nastavovanie bez klikov.',
  grinderAddUseLabel: 'Na čo ho používaš',
  grinderAddCalibrationHelp:
    'Mikrónovú kalibráciu zadávať nemusíš. Bez nej appka pri prepočtoch upozorní, že sú menej presné.',
  grinderAddVisibilityHelp: 'Vlastný mlynček vidíš len ty, kým ho neoveríme.',
  grinderAddSubmit: 'Pridať do katalógu',

  grinderErrorBrandRequired: 'Zadaj značku.',
  grinderErrorModelRequired: 'Zadaj model.',
  grinderErrorSettingInvalid: 'Zadaj číslo.',
  grinderErrorRangeInvalid: 'Najjemnejšie nastavenie musí byť menšie ako najhrubšie.',
  grinderErrorStepInvalid: 'Krok nemôže byť záporný.',
  grinderErrorAddFailed: 'Mlynček sa nepodarilo pridať. Skús to znova.',
  grinderErrorAlreadyCatalogued: 'Tento mlynček už v katalógu je.',
} as const;
