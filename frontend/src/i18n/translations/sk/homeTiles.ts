/**
 * The home screen once it is a grid rather than a column of prompts.
 *
 * Everything here is written to be true of an account with nothing in it and
 * of one with a year of brewing behind it: a tile reports what it knows and
 * says plainly when it knows nothing, because a dashboard that prints a zero
 * where it has no measurement is a dashboard that has started guessing.
 *
 * Counts are printed after a colon rather than inside a sentence. Slovak
 * agrees a noun with its number three different ways, and "1 balíček",
 * "3 balíčky" and "5 balíčkov" cannot be one template - so the number is put
 * where the grammar does not reach it.
 */
export const SK_HOME_TILES = {
  homeGreetingMorning: 'Dobré ráno',
  homeGreetingDay: 'Dobrý deň',
  homeGreetingEvening: 'Dobrý večer',
  homeGreetingNight: 'Ešte hore?',
  homeGreetingSubtitle: 'Poďme sa pozrieť na tvoju kávu.',

  homeTileScanTitle: 'Stojíš v obchode?',
  homeTileQuickBrewTitle: 'Rýchle varenie',
  homeTileQuickBrewCaption: 'Recept bez zapisovania.',
  homeTileBrewTitle: 'Uvariť',
  homeTileBrewCaption: 'Z toho, čo máš doma.',

  homeTileTasteTitle: 'Tvoja chuť',
  homeTileTasteCaption: 'Poznám ťa: {level}',
  homeTileTasteUnknown: 'Ešte ťa nepoznám. Pár otázok a budem vedieť, čo ti odporúčať.',
  homeTileTasteChartLabel: 'Tvoj chuťový profil',

  homeTileInventoryTitle: 'V skrinke',
  homeTileInventoryCaption: 'Balíčky: {bags} · Pripravené: {ready}',
  homeTileInventoryEmpty: 'Zatiaľ prázdna - pridaj balíček.',
  homeTileInventoryUnweighed: 'Nezvážené',
  homeTileInventoryRemainingLabel: 'Koľko kávy ti ostáva',
  homeTileInventoryFreshnessLabel: 'Stav balíčkov v skrinke',

  homeTileStatsTitle: 'Tvoje varenia',
  homeTileStatsCaption: 'Posledných sedem dní',
  homeTileStatsNone: 'Zatiaľ ani jedno - a to sa dá zmeniť teraz.',
  homeTileStatsTotalLabel: 'Spolu varení',
  homeTileStatsWeekLabel: 'Posledných sedem dní',

  homeHintNoCoffeeTitle: 'V skrinke máš prázdno',
  homeHintNoCoffeeBody: 'Zapíš si balíček, ktorý máš doma. Bude z toho história, z ktorej sa učím.',
  homeHintAgingTitle: '{name} už starne',
  homeHintAgingBody: 'Praženú ju máš vyše mesiaca. Vypi ju radšej čoskoro, kým má z čoho dávať.',
  homeHintRestingTitle: '{name} ešte odpočíva',
  homeHintRestingBody: 'Nechaj ju ešte pár dní na pokoji. Potom to bude iná káva.',
  homeHintReadyTitle: '{name} je akurát teraz',
  homeHintReadyBody: 'Je presne v okne, kedy dáva najviac. Škoda by bolo čakať.',
  homeHintFirstBrewTitle: 'Prvá káva ešte len príde',
  homeHintFirstBrewBody: 'Nemusíš nič vypĺňať. Povedz mi, v čom variš, a recept máš hneď.',
  homeHintIdleTitle: 'Dlho si nevaril',
  homeHintIdleBody: 'Naposledy pred vyše týždňom. Recept na tvoju kávu mám stále pripravený.',

  homeHintTipGrindTitle: 'Meň naraz jednu vec',
  homeHintTipGrindBody: 'Keď posunieš mlynček aj dávku spolu, z výsledku sa nedozvieš nič.',
  homeHintTipWaterTitle: 'Káva je hlavne voda',
  homeHintTipWaterBody:
    'Tvrdá voda z kohútika zoberie kyslosť aj sladkosť. Skús filtrovanú a porovnaj.',
  homeHintTipBloomTitle: 'Nechaj kávu vydýchať',
  homeHintTipBloomBody:
    'Prvé zaliatie ju má len namočiť. Pol minúty stačí, aby z nej odišiel plyn.',
  homeHintTipSourTitle: 'Kyslá znamená málo, horká veľa',
  homeHintTipSourBody: 'Kyslá káva býva podextrahovaná - pomeľ jemnejšie. Pri horkej je to naopak.',
  homeHintTipDescribeTitle: 'Opíš mi kávu vlastnými slovami',
  homeHintTipDescribeBody:
    'Nepotrebujem známky. „Bola slabá a kyslá" mi povie viac než hviezdičky.',
  homeHintTipScaleTitle: 'Váha urobí viac než drahý mlynček',
  homeHintTipScaleBody: 'Bez nej nevieš, čo si zopakoval. S ňou je z náhody recept.',
} as const;
