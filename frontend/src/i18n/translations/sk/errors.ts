/**
 * What the app says when a request fails.
 *
 * Addressed by the shared error code, and never showing it: `NOT_FOUND` on a
 * screen is the app telling somebody about its own internals instead of about
 * their coffee. Every sentence here says what happened and, where there is
 * one, what to do about it.
 */
export const SK_ERRORS = {
  errorUnknown: 'Niečo sa nepodarilo. Skús to prosím znova.',
  errorNetwork: 'Nepodarilo sa spojiť so serverom.',
  errorTimeout: 'Server neodpovedal včas. Skús to prosím znova.',
  errorUnauthorized: 'Prihlásenie vypršalo. Prihlás sa prosím znova.',
  errorForbidden: 'Na túto akciu nemáš oprávnenie.',
  errorNotFound: 'Toto sa už nenašlo. Možno to medzitým zmizlo.',
  errorBadRequest: 'Niektoré údaje neboli v poriadku. Skontroluj ich prosím.',
  errorValidation: 'Niektoré údaje neboli v poriadku. Skontroluj ich prosím.',
  errorConflict: 'Toto sa práve teraz nedá urobiť.',
  errorTooManyRequests: 'Príliš veľa pokusov za sebou. Skús to prosím o chvíľu.',
  errorInternal: 'Na našej strane nastala chyba. Skús to prosím o chvíľu.',
  errorUnavailable: 'Server je práve nedostupný. Skús to prosím o chvíľu.',
  errorInvalidResponse: 'Zo servera prišla odpoveď, ktorej appka nerozumie.',

  errorOfflineTitle: 'Nie si online',
  errorOfflineBody:
    'Skontroluj pripojenie. Čo už mám stiahnuté, funguje aj bez siete - zvyšok načítam, keď sa vrátiš.',
  errorOfflineNotice: 'Si offline. Zmeny sa uložia, až keď budeš mať signál.',
} as const;
