import type { ColorPalette } from '../../../theme';
import type { TextTone } from '../Text';

/** What kind of remark this is: an aside, a warning, or a reassurance. */
export type InfoNoteTone = 'plain' | 'caution' | 'fresh';

export const DEFAULT_INFO_NOTE_TONE: InfoNoteTone = 'plain';

export const INFO_NOTE_ICON_COLORS = {
  plain: 'onSurfaceVariant',
  caution: 'onCaution',
  fresh: 'onFresh',
} as const satisfies Record<InfoNoteTone, keyof ColorPalette>;

export const INFO_NOTE_TEXT_TONES = {
  plain: 'muted',
  caution: 'muted',
  fresh: 'default',
} as const satisfies Record<InfoNoteTone, TextTone>;

export const INFO_NOTE_ICONS = {
  plain: 'information-outline',
  caution: 'alert-circle-outline',
  fresh: 'information-outline',
} as const satisfies Record<InfoNoteTone, string>;
