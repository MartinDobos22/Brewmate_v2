import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';

type MaterialIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

/** The glyph over a brewer the catalogue could not name. */
export const CHAT_HEADER_ICONS = {
  unknownMethod: 'help-circle-outline',
} as const satisfies Record<string, MaterialIconName>;

/** Saying how the coffee was, and sending it. */
export const CHAT_COMPOSER_ICONS = {
  send: 'arrow-up',
} as const satisfies Record<string, MaterialIconName>;

/** The proposal: what it is, which way each value moved, and taking it. */
export const CHAT_PATCH_ICONS = {
  heading: 'tune-vertical-variant',
  arrow: 'arrow-right',
  apply: 'check',
} as const satisfies Record<string, MaterialIconName>;

/**
 * A glyph per row of the diff.
 *
 * The rows of a patch are the handful of things a recipe is made of, and each
 * of them already has a picture elsewhere in the app - a grain for the grind,
 * a thermometer for the water. Repeating those here is what lets somebody find
 * the line they care about without reading four uppercase labels: the mark is
 * recognised, the label confirms it.
 */
export const PATCH_ROW_ICONS = {
  dose: 'scale-balance',
  water: 'cup-water',
  ratio: 'division',
  grind: 'grain',
  grindLabel: 'grain',
  temperature: 'thermometer',
  totalTime: 'timer-outline',
  steps: 'water-outline',
} as const satisfies Record<string, MaterialIconName>;

export type PatchRowIcon = (typeof PATCH_ROW_ICONS)[keyof typeof PATCH_ROW_ICONS];
