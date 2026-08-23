import type { KeyboardTypeOptions } from 'react-native';

import type { BrewerDetailsValues } from '../../services';

/** One field at a time, the way the sheet reports a change. */
export type BrewerDetailsChange = (patch: Partial<BrewerDetailsValues>) => void;

export const DECIMAL_KEYBOARD: KeyboardTypeOptions = 'decimal-pad';
