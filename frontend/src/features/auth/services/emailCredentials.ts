import { PASSWORD_MIN_LENGTH } from '@brewmate/shared';

import { TRANSLATION_KEYS, type TranslationKey } from '../../../i18n';

export interface EmailCredentials {
  readonly email: string;
  readonly password: string;
}

/** One message per field, or null when the field is fine. */
export interface CredentialErrors {
  readonly email: TranslationKey | null;
  readonly password: TranslationKey | null;
}

const EMPTY = '';
/** Deliberately loose: the address is verified by e-mail, not by a regex. */
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const hasCredentialError = (errors: CredentialErrors): boolean =>
  errors.email !== null || errors.password !== null;

/** Also used on its own by the password reset form, which has no password. */
export const validateEmailAddress = (email: string): TranslationKey | null => {
  if (email === EMPTY) {
    return TRANSLATION_KEYS.authErrorEmailRequired;
  }

  return EMAIL_SHAPE.test(email) ? null : TRANSLATION_KEYS.authErrorEmailInvalid;
};

const validatePassword = (password: string): TranslationKey | null => {
  if (password === EMPTY) {
    return TRANSLATION_KEYS.authErrorPasswordRequired;
  }

  return password.length < PASSWORD_MIN_LENGTH ? TRANSLATION_KEYS.authErrorPasswordTooShort : null;
};

/**
 * Checks the form before a request is made, so an obvious mistake costs the
 * user nothing and never reaches Firebase as a raw error code.
 */
export const validateCredentials = ({ email, password }: EmailCredentials): CredentialErrors => ({
  email: validateEmailAddress(email.trim()),
  password: validatePassword(password),
});

/** Only the address is normalised; a password is taken exactly as typed. */
export const normalizeCredentials = ({ email, password }: EmailCredentials): EmailCredentials => ({
  email: email.trim(),
  password,
});
