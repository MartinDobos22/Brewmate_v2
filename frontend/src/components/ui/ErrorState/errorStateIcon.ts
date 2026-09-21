import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';

/**
 * A plug that is not connected, rather than a warning triangle.
 *
 * Almost every failure this state is drawn for is a request that did not
 * arrive, and a triangle reads as something the reader did wrong.
 */
export const ERROR_STATE_ICON: ComponentProps<typeof MaterialCommunityIcons>['name'] =
  'wifi-strength-alert-outline';
