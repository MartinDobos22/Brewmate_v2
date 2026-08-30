/**
 * Copy for signing in, registering and managing the account.
 *
 * The error strings are the whole point of the group: the user never sees a
 * raw Firebase code such as `auth/invalid-credential`, only a sentence that
 * says what happened and what to do about it.
 *
 * The two strings that name a password length spell out PASSWORD_MIN_LENGTH
 * from @brewmate/shared - copy cannot interpolate, so changing that bound
 * means changing these sentences too.
 */
export const SK_AUTH = {
  authSignInTitle: 'Prihlásenie',
  authSignInSubtitle: 'Prihlás sa a Brewmate si zapamätá tvoju kávu.',
  authSignUpTitle: 'Registrácia',
  authSignUpSubtitle: 'Vytvor si účet a začni si zapisovať prípravy.',
  authEmailLabel: 'E-mail',
  authEmailPlaceholder: 'meno@priklad.sk',
  authPasswordLabel: 'Heslo',
  authPasswordPlaceholder: 'Aspoň 6 znakov',
  authSignInAction: 'Prihlásiť sa',
  authSignUpAction: 'Vytvoriť účet',
  authForgotPasswordAction: 'Zabudnuté heslo?',
  authNoAccountQuestion: 'Nemáš účet?',
  authGoToSignUp: 'Zaregistruj sa',
  authHasAccountQuestion: 'Už máš účet?',
  authGoToSignIn: 'Prihlás sa',
  authDividerOr: 'alebo',
  authGoogleAction: 'Pokračovať cez Google',
  authAppleAction: 'Pokračovať cez Apple',

  authOfflineTitle: 'Si offline',
  authOfflineBody: 'Prihlásenie potrebuje pripojenie na internet. Skús to znova, keď budeš online.',

  authResetTitle: 'Obnova hesla',
  authResetBody:
    'Zadaj e-mail, ktorým sa prihlasuješ. Pošleme naň odkaz na nastavenie nového hesla.',
  authResetAction: 'Poslať odkaz',
  authResetSent: 'Ak k tomuto e-mailu existuje účet, odkaz na zmenu hesla je už na ceste.',
  authResetBackAction: 'Späť na prihlásenie',

  authVerifyTitle: 'Over si e-mail',
  authVerifyBody: 'Poslali sme ti overovací odkaz. Otvor ho a potom sa sem vráť.',
  authVerifyResendAction: 'Poslať e-mail znova',
  authVerifySentNotice: 'Overovací e-mail sme poslali.',
  authVerifyCheckAction: 'Už som to overil',
  authVerifyPendingNotice: 'E-mail zatiaľ nie je overený. Skontroluj aj spam.',
  authVerifiedNotice: 'E-mail je overený.',
  authVerifyContinueAction: 'Pokračovať do aplikácie',

  authAccountEmailUnknown: 'Účet bez e-mailu',
  authSignOutAction: 'Odhlásiť sa',
  authDeleteAccountTitle: 'Zmazanie účtu',
  authDeleteAccountBody:
    'Zmaže tvoje prihlásenie aj všetky údaje, ktoré o tebe máme na serveri. Nedá sa to vrátiť späť.',
  authDeleteAccountAction: 'Zmazať účet',
  authDeleteConfirmTitle: 'Naozaj zmazať účet?',
  authDeleteConfirmBody: 'Tvoje údaje sa nenávratne zmažú a z aplikácie ťa odhlásime.',
  authDeleteConfirmAction: 'Zmazať',

  authErrorEmailRequired: 'Zadaj e-mail.',
  authErrorEmailInvalid: 'E-mail nemá správny tvar.',
  authErrorPasswordRequired: 'Zadaj heslo.',
  authErrorPasswordTooShort: 'Heslo musí mať aspoň 6 znakov.',
  authErrorInvalidCredentials: 'Nesprávny e-mail alebo heslo.',
  authErrorEmailInUse: 'Na tento e-mail už účet existuje. Skús sa prihlásiť.',
  authErrorWeakPassword: 'Heslo je príliš slabé. Zvoľ dlhšie.',
  authErrorUserDisabled: 'Tento účet je zablokovaný.',
  authErrorTooManyAttempts: 'Priveľa pokusov. Skús to o pár minút.',
  authErrorNetwork: 'Nepodarilo sa spojiť so serverom. Skontroluj pripojenie.',
  authErrorRecentLoginRequired: 'Kvôli bezpečnosti sa prihlás znova a skús to hneď potom.',
  authErrorAccountExistsWithOtherProvider:
    'K tomuto e-mailu už patrí účet vytvorený iným spôsobom prihlásenia.',
  authErrorAppleUnavailable: 'Prihlásenie cez Apple funguje len na iPhone a iPade.',
  authErrorGoogleUnavailable: 'Prihlásenie cez Google nie je v tejto verzii nastavené.',
  authErrorDeleteFailed: 'Účet sa nepodarilo zmazať. Skús to znova.',
  authErrorUnknown: 'Nepodarilo sa to. Skús to prosím znova.',
} as const;
