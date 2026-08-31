/**
 * The two questions asked only of somebody who does not brew.
 *
 * Both go around the word rather than through it. "Kyslosť" to somebody who
 * has never had a light roast brewed properly means the taste of a cup that
 * has gone off, so asked whether they want an acidic coffee they say no and
 * mean something else entirely - and the profile records the wrong answer with
 * full confidence. Fruit asks about the same axis in words nobody can
 * misunderstand.
 */
export const SK_TASTE_QUESTIONS_BEGINNER = {
  tqEverydayPrompt: 'Akú kávu piješ teraz?',
  tqEverydayHelp: 'Nie je to skúška. Chcem vedieť, od čoho sa odrazím.',
  tqEverydayInstant: 'Instantnú',
  tqEverydayInstantNote: 'Zalejem a je.',
  tqEverydayCapsule: 'Z kapsule alebo z automatu',
  tqEverydayCapsuleNote: 'Espresso alebo lungo, väčšinou tmavšie a plné.',
  tqEverydayMilkDrink: 'Latte, cappuccino, flat white',
  tqEverydayMilkDrinkNote: 'Káva s mliekom, väčšinou z kaviarne.',
  tqEverydayFilter: 'Prekvapkávanú alebo z frenchpressu',
  tqEverydayFilterNote: 'Väčší hrnček, ľahšia a čistejšia chuť.',
  tqEverydayRarely: 'Skoro žiadnu, začínam',

  tqFruitPrompt: 'Po akom ovocí siahneš najradšej?',
  tqFruitHelp: 'Znie to od veci, ale odpoveď mi o tvojej káve povie viac než otázka o káve.',
  tqFruitCitrus: 'Citrusy - pomaranč, grep, limetka',
  tqFruitBerry: 'Bobule - maliny, jahody, čučoriedky',
  tqFruitStone: 'Sladké a mäkké - broskyňa, hruška, banán',
  tqFruitNone: 'Ovocie ma veľmi neberie',
  tqFruitNoneNote: 'Radšej niečo orechové alebo čokoládové.',
} as const;
