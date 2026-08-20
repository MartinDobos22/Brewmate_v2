import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Loads a dotenv file into process.env using Node's built-in loader.
 * Missing files are not an error - hosted environments inject variables directly.
 *
 * @returns true when the file existed and was loaded.
 */
export const loadEnvFile = (fileName: string, cwd: string = process.cwd()): boolean => {
  const filePath = resolve(cwd, fileName);

  if (!existsSync(filePath)) {
    return false;
  }

  process.loadEnvFile(filePath);

  return true;
};
