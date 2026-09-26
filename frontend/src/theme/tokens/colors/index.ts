/**
 * The only folder in the app allowed to contain colour literals.
 * ESLint rejects a hex colour anywhere outside src/theme/tokens.
 *
 * Three kinds of role live here, and the difference is load-bearing:
 *
 * 1. The Material Design 3 roles, which differ between the two schemes.
 * 2. `ESPRESSO` - a dark block drawn at the top of a light screen, identical
 *    in both schemes because it is the same object on both.
 * 3. `BREW_GROUND` - brew mode, the one screen that is dark end to end
 *    whatever the phone is set to.
 *
 * The latter two are spread into each palette, so every component keeps the
 * one access path it already has: `theme.colors.<role>`.
 */
export { ESPRESSO } from './espressoRoles';
export type { EspressoRoles } from './espressoRoles';
export { BREW_GROUND } from './brewGroundRoles';
export type { BrewGroundRoles } from './brewGroundRoles';
export type { ColorPalette } from './colorPalette';
export { LIGHT_COLORS } from './lightColors';
export { DARK_COLORS } from './darkColors';
