import { Platform } from 'react-native';
import type { KeyboardAvoidingViewProps } from 'react-native';

/**
 * How a screen with a bar against the bottom edge gets out of the keyboard's
 * way, which is not the same answer on both platforms.
 *
 * iOS puts the keyboard over the window and reports nothing to the layout, so
 * the view has to be padded by its height. Android resizes the window itself
 * for most apps, and padding it a second time lifts the bar off the keyboard
 * by twice what it needs - so there it is told to do nothing.
 */
export const KEYBOARD_AVOIDING_BEHAVIOR: KeyboardAvoidingViewProps['behavior'] = Platform.select({
  ios: 'padding',
});
