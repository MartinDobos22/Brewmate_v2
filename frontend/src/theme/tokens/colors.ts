/**
 * The only file in the app allowed to contain colour literals.
 * ESLint rejects a hex colour anywhere outside src/theme/tokens.
 */
export const COLORS = {
  espresso: '#3B2314',
  crema: '#C8A27A',
  roast: '#6B4226',
  surface: '#FFFBF5',
  surfaceInverse: '#1B1310',
  textPrimary: '#241812',
  textSecondary: '#6F5A4C',
  textInverse: '#FFFBF5',
  border: '#E3D3C0',
  danger: '#A8321E',
} as const;

export type ColorToken = keyof typeof COLORS;
