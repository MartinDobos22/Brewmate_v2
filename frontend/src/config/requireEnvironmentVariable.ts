import type { EnvironmentKey } from './environmentKeys';
import { readEnvironmentVariable } from './readEnvironmentVariable';

const missingVariableMessage = (key: EnvironmentKey): string =>
  `${key} is not set. Copy .env.example to .env.`;

/**
 * Reads a variable the app cannot run without.
 *
 * @throws Error naming the variable, so a misconfigured build fails with the
 * fix in the message instead of a confusing crash deeper in the SDK.
 */
export const requireEnvironmentVariable = (key: EnvironmentKey): string => {
  const value = readEnvironmentVariable(key);

  if (value === undefined || value === '') {
    throw new Error(missingVariableMessage(key));
  }

  return value;
};
