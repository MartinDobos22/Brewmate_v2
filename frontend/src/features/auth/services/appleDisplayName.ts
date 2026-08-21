import * as AppleAuthentication from 'expo-apple-authentication';

const EMPTY = '';
const NAME_SEPARATOR = ' ';

/**
 * Apple hands over the user's name only during the very first authorisation,
 * and never again. Whatever comes back is turned into a display name there and
 * then, or the account keeps none at all.
 */
export const toAppleDisplayName = (
  fullName: AppleAuthentication.AppleAuthenticationFullName | null,
): string | null => {
  if (fullName === null) {
    return null;
  }

  const name = [fullName.givenName, fullName.familyName]
    .filter((part): part is string => part !== null && part !== EMPTY)
    .join(NAME_SEPARATOR);

  return name === EMPTY ? null : name;
};
