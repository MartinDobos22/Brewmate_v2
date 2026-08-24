/**
 * The conversation after the cup - the main way Brewmate learns anything.
 *
 * The opening question is deliberately open. A form with five sliders would be
 * easier to build and nobody would fill it in twice; "aké to bolo?" gets
 * answered because it is a question somebody can answer while holding a mug.
 */
export const SK_RECIPE_CHAT = {
  recipeChatTitle: 'Ako to dopadlo?',
  recipeChatOpening:
    'Tak čo, aké to bolo? Napíš to pokojne vlastnými slovami - "kyslé", "prázdne", "chcem to sladšie". Aj jedna veta mi stačí.',
  recipeChatPlaceholder: 'Napíš, ako ti chutila...',
  recipeChatSend: 'Odoslať',
  recipeChatSending: 'Premýšľam...',
  recipeChatError: 'Odpoveď sa nepodarilo načítať. Skús to prosím znova.',
  recipeChatOffline: 'Si offline. Napíšem ti, keď budeš mať signál.',

  recipeChatChipSweeter: 'Sladšie',
  recipeChatChipLessAcidic: 'Menej kyslé',
  recipeChatChipStronger: 'Silnejšie',
  recipeChatChipWeaker: 'Slabšie',
  recipeChatChipLessBitter: 'Menej horké',
  recipeChatChipFaster: 'Mal som menej času',

  recipeChatChipMessageSweeter: 'Chcel by som to sladšie.',
  recipeChatChipMessageLessAcidic: 'Bolo mi to príliš kyslé.',
  recipeChatChipMessageStronger: 'Bolo to slabé, chcem to silnejšie.',
  recipeChatChipMessageWeaker: 'Bolo to na mňa priveľmi silné.',
  recipeChatChipMessageLessBitter: 'Bolo to horké.',
  recipeChatChipMessageFaster: 'Mal som menej času, než recept počítal.',

  recipePatchTitle: 'Navrhujem zmenu',
  recipePatchApply: 'Použiť zmenu',
  recipePatchApplying: 'Ukladám...',
  recipePatchApplied: 'Zmenu som uložil ako novú verziu receptu.',
  recipePatchError: 'Zmenu sa nepodarilo uložiť. Skús to prosím znova.',
  recipePatchArrow: '→',

  recipePatchDose: 'Dávka',
  recipePatchWater: 'Voda',
  recipePatchRatio: 'Pomer',
  recipePatchGrind: 'Mletie',
  recipePatchGrindLabel: 'Mletie slovami',
  recipePatchTemperature: 'Teplota',
  recipePatchTotalTime: 'Celkový čas',
  recipePatchSteps: 'Rozpis nalievania',
  recipePatchStepsChanged: 'prepísaný',

  recipeSaveAction: 'Uložiť recept',
  recipeSavedNotice: 'Recept mám uložený pre túto kávu a prípravu.',
  recipeSaveError: 'Recept sa nepodarilo uložiť. Skús to prosím znova.',

  recipeChatConstrainedNotice:
    'Toto varenie malo obmedzenia, tak z neho o tvojej chuti usudzujem menej.',
} as const;
