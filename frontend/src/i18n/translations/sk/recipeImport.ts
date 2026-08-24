/**
 * Prepočet cudzieho receptu.
 *
 * Každá veta tu má jednu úlohu: povedať, čo je vypočítané presne a čo je
 * odhad. Prepočítané mletie vyzerá na obrazovke rovnako ako odmerané - ak to
 * appka nepovie nahlas, nepovie to nikto.
 */
export const SK_RECIPE_IMPORT = {
  importRecipeTitle: 'Cudzí recept na tvoje vybavenie',
  importRecipeIntro:
    'Máš recept z videa alebo od pražiarne? Prepočítam ti ho na tvoj mlynček a tvoj brewer.',

  importSourceSection: 'Odkiaľ ten recept máš',
  importSourcePasteLabel: 'Vlož text',
  importSourcePastePlaceholder: 'Napríklad: 18 g kávy, 300 g vody, 94 °C, stredne jemné, 2:30',
  importSourcePhoto: 'Odfotiť alebo vybrať screenshot',
  importSourceRead: 'Prečítaj to',
  importSourceReading: 'Čítam...',
  importSourceManual: 'Zadám to radšej ručne',
  importSourceEmpty: 'Vlož text alebo pridaj obrázok - inak nemám čo čítať.',
  importSourceError: 'Recept sa nepodarilo prečítať. Skús to znova alebo ho zadaj ručne.',
  importSourcePhotoError: 'Obrázok sa nepodarilo nahrať. Skús iný alebo vlož text.',

  importReviewTitle: 'Rozumiem tomu takto',
  importReviewIntro:
    'Toto som z receptu vyčítal. Čo je prázdne, v ňom nebolo - doplň to len ak to vieš.',
  importReviewLabel: 'Názov receptu',
  importReviewDose: 'Dávka (g)',
  importReviewWater: 'Voda alebo výtlačok (g)',
  importReviewGrindSetting: 'Mletie na jeho mlynčeku',
  importReviewGrindLabel: 'Mletie slovami',
  importReviewTemp: 'Teplota (°C)',
  importReviewTime: 'Celkový čas (s)',
  importReviewGrinderUnknown: 'Mlynček z receptu nepoznám - pôjdem podľa slov a metódy.',
  importReviewSteps: 'Rozpis nalievania: {count} krokov',
  importReviewNoSteps: 'Recept nemal rozpis nalievania.',

  importTargetTitle: 'A na čom to budeš variť ty',
  importTargetIntro: 'Podľa toho prepočítam dávku, vodu aj mletie.',
  importConvert: 'Prepočítaj to',
  importConverting: 'Prepočítavam...',
  importConvertError: 'Prepočet sa teraz nepodaril. Skús to o chvíľu znova.',
  importMissingMethod: 'Vyber, v čom to budeš variť.',

  importResultTitle: 'Tvoja verzia receptu',
  importResultBrew: 'Uvariť podľa toho',
  importResultChat: 'Chcem sa na to opýtať',

  conversionReportTitle: 'Čo je presné a čo odhad',
  conversionReportOpen: 'Ukáž, čo je presné a čo odhad',
  conversionReportClose: 'Skryť podrobnosti',
  conversionGrindStartingPoint:
    'Mletie je vždy len štartovací bod. Uvar jednu a odtiaľ dolaď - dva mlynčeky sa dajú porovnať len cez to, čo naozaj namelú.',

  conversionNoteHeading: '{field}: {precision}',
  conversionPrecisionExact: 'presne',
  conversionPrecisionEstimated: 'odhad',
  conversionPrecisionUnknown: 'nevedno',

  conversionFieldGrind: 'Mletie',
  conversionFieldDose: 'Dávka',
  conversionFieldWater: 'Voda',
  conversionFieldRatio: 'Pomer',
  conversionFieldTemperature: 'Teplota',
  conversionFieldSchedule: 'Rozpis nalievania',
  conversionFieldTime: 'Čas',

  conversionReasonFromStatedMicrons: 'Recept uvádzal veľkosť častíc priamo v mikrónoch.',
  conversionReasonFromBothCalibrations:
    'Prepočítané cez kalibračné krivky oboch mlynčekov, teda cez mikróny.',
  conversionReasonFromGrindWords: 'Odvodené z toho, ako recept mletie opísal slovami.',
  conversionReasonFromMethodCategory:
    'Recept o mletí nepovedal nič, tak som vzal to, čo sa pre túto metódu zvykne mlieť.',
  conversionReasonCalibrationEstimated:
    'Kalibrácia jedného z mlynčekov je odhad, nie meranie - čísla sú orientačné.',
  conversionReasonGrinderUnverified:
    'Jeden zo záznamov o mlynčeku pridal používateľ a nie je overený.',
  conversionReasonOutsideCalibratedRange:
    'Nastavenie leží za koncom nameranej krivky, tak som ju predĺžil.',
  conversionReasonTargetGrinderUncalibrated:
    'Tvoj mlynček nemá kalibráciu, tak ti dávam mletie slovami namiesto čísla.',
  conversionReasonGrindNotAdjustable: 'Mletie sa pre toto varenie nedá zmeniť.',
  conversionReasonKeptFromSource: 'Prevzaté z originálu bez zmeny.',
  conversionReasonRatioPreserved: 'Pomer je vypočítaný z dvoch váh originálu.',
  conversionReasonScaledToCapacity: 'Zmenšené na to, koľko zoberie tvoj brewer, v rovnakom pomere.',
  conversionReasonScaledToDoseWindow: 'Upravené na dávku, s akou tvoj brewer pracuje.',
  conversionReasonClampedToMethodWindow:
    'Originál bol na iný typ prípravy, tak som pomer stiahol do okna tvojej metódy.',
  conversionReasonScaledWithWater: 'Rozpis nalievania som prepočítal spolu s vodou.',
  conversionReasonDifferentMethodCategory:
    'Originál bol na iný typ brewera, rozpis sa preniesť nedal - napísal som nový.',
  conversionReasonNoTemperatureControl:
    'Teplotu nastaviť nevieš, tak namiesto čísla dostaneš postup.',
  conversionReasonNotStatedInSource: 'Originál to neuvádzal, toto je bežná hodnota pre metódu.',
} as const;
