import type { KeyboardTypeOptions } from 'react-native';

import type { GrinderFormValues } from '../../services';

/** Applies one field at a time, so the form owns the whole value. */
export type GrinderFieldChange = (patch: Partial<GrinderFormValues>) => void;

/** A collar setting can be 2,5 as easily as 25, so the dot is on the keyboard. */
export const NUMERIC_KEYBOARD: KeyboardTypeOptions = 'decimal-pad';
