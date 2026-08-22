/**
 * The five questions that ask about something else.
 *
 * Most people cannot say how much body they want, but everybody knows whether
 * they reach for milk chocolate or dark. These calibrate the same axes through
 * things a person has actually tasted, which is why they are mixed in with the
 * direct ones instead of replacing them.
 */
export const SK_TASTE_QUESTIONS_INDIRECT = {
  tqTeaPrompt: 'Ovocný alebo čierny čaj?',
  tqTeaHelp: 'Toto nie je otázka o káve. Pomáha mi naladiť sa na tvoju chuť.',
  tqTeaFruit: 'Ovocný',
  tqTeaBlack: 'Čierny',
  tqTeaGreen: 'Zelený',
  tqTeaNone: 'Čaj nepijem',

  tqChocolatePrompt: 'Mliečna alebo horká čokoláda?',
  tqChocolateHelp: 'Podľa toho viem, koľko sladkosti a koľko horkosti znesieš.',
  tqChocolateMilk: 'Mliečna',
  tqChocolateDark: 'Horká, aspoň sedemdesiatpercentná',
  tqChocolateBoth: 'Obe rovnako rád',

  tqMilkPrompt: 'Piješ kávu s mliekom?',
  tqMilkHelp: 'Mlieko schová kyslosť a pridá sladkosť, tak s tým budem počítať.',
  tqMilkNever: 'Nikdy, len čiernu',
  tqMilkSometimes: 'Občas',
  tqMilkOften: 'Väčšinou áno',
  tqMilkAlways: 'Vždy',

  tqAromaPrompt: 'Ktorá vôňa ťa láka najviac?',
  tqAromaHelp: 'Predstav si, že otváraš čerstvý balíček.',
  tqAromaCitrus: 'Citrusy a bobule',
  tqAromaNutty: 'Orechy a karamel',
  tqAromaFloral: 'Kvety a bylinky',
  tqAromaCocoa: 'Čokoláda a korenie',

  tqGoalPrompt: 'Čo má dobrá káva urobiť ako prvé?',
  tqGoalHelp: 'Posledná otázka.',
  tqGoalSweet: 'Byť prirodzene sladká',
  tqGoalBright: 'Zaujať ovocnou kyslosťou',
  tqGoalStrong: 'Byť sýta a výrazná',
  tqGoalClean: 'Byť čistá a jemná',
} as const;
