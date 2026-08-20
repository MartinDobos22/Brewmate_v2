const ESCAPED_NEWLINE = String.raw`\n`;
const NEWLINE = '\n';

/**
 * Environment variables cannot hold real newlines, so PEM keys are stored with
 * escaped ones. Firebase Admin needs them expanded back.
 */
export const normalizePrivateKey = (privateKey: string): string =>
  privateKey.split(ESCAPED_NEWLINE).join(NEWLINE);
