import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';

/**
 * Return types for the `create<Component>Styles` factories. Naming the keys in
 * the type keeps every stylesheet explicit without repeating each entry twice.
 *
 * A mixed stylesheet intersects them:
 * `ViewStyles<'container' | 'row'> & TextStyles<'label'>`.
 */
export type ViewStyles<TKey extends string> = Record<TKey, ViewStyle>;
export type TextStyles<TKey extends string> = Record<TKey, TextStyle>;
export type ImageStyles<TKey extends string> = Record<TKey, ImageStyle>;
