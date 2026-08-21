import type { CredentialErrors } from '../../services';

/** The state of a form nobody has submitted yet: no field is wrong. */
export const NO_CREDENTIAL_ERRORS: CredentialErrors = { email: null, password: null };
