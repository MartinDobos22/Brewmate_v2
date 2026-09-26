import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';

/**
 * The mark on the card that was chosen.
 *
 * Filled rather than outlined, and the only filled glyph on the card: the
 * badge on the left says what the option is and this says that it is the
 * answer, so the two must not read as a pair of equal marks.
 */
export const OPTION_CHOSEN_ICON: ComponentProps<typeof MaterialCommunityIcons>['name'] =
  'check-circle';
