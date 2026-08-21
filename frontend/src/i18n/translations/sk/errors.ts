/** Client-facing error copy, addressed by the shared error code. */
export const SK_ERRORS = {
  errorUnknown: 'Neznáma chyba.',
  errorNetwork: 'Nepodarilo sa spojiť so serverom.',
  errorTimeout: 'Server neodpovedal včas.',
  errorUnauthorized: 'Prihlásenie vypršalo.',
  errorForbidden: 'Na túto akciu nemáš oprávnenie.',
  errorNotFound: 'Nenašlo sa to.',
  errorBadRequest: 'Požiadavka nebola v poriadku.',
  errorValidation: 'Odpoveď servera nesedí s dohodnutým formátom.',
  errorInternal: 'Na serveri nastala chyba.',
} as const;
