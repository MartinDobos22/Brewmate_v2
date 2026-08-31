/**
 * Every point on every axis, in words.
 *
 * Twenty-five strings rather than five, because Slovak declines the adjective
 * for the noun it belongs to and because each axis wants its own vocabulary:
 * a low body is "ľahké", not "nízke"; low bitterness is not a shortcoming but
 * the thing most people are after; and a very high intensity is best described
 * by what it does rather than by how much of it there is.
 *
 * None of them is a number, and that is the point. "Kyslosť 7,4" is a
 * measurement of something nobody measured, and printed to a decimal place it
 * invites the reader to argue with the digit instead of with the claim.
 */
export const SK_TASTE_AXIS_BANDS = {
  bandAcidityVeryLow: 'Takmer žiadna',
  bandAcidityLow: 'Skôr jemná',
  bandAcidityBalanced: 'Vyvážená',
  bandAcidityHigh: 'Živá',
  bandAcidityVeryHigh: 'Výrazná, ovocná',

  bandSweetnessVeryLow: 'Sladkosť neriešiš',
  bandSweetnessLow: 'Skôr suchšia chuť',
  bandSweetnessBalanced: 'Vyvážená',
  bandSweetnessHigh: 'Sladšia',
  bandSweetnessVeryHigh: 'Výrazne sladká',

  bandBodyVeryLow: 'Veľmi ľahké, čajové',
  bandBodyLow: 'Ľahšie',
  bandBodyBalanced: 'Stredné',
  bandBodyHigh: 'Plnšie',
  bandBodyVeryHigh: 'Husté a ťažké',

  bandBitternessVeryLow: 'Horkosť ti vadí',
  bandBitternessLow: 'Radšej bez nej',
  bandBitternessBalanced: 'Znesieš ju',
  bandBitternessHigh: 'Trochu ti sadne',
  bandBitternessVeryHigh: 'Máš ju rád',

  bandIntensityVeryLow: 'Veľmi jemná káva',
  bandIntensityLow: 'Skôr jemnejšia',
  bandIntensityBalanced: 'Stredne silná',
  bandIntensityHigh: 'Silnejšia',
  bandIntensityVeryHigh: 'Poriadne silná',
} as const;
