import type { ColorPalette, ElevationToken, SizeToken, TypographyToken } from '../../../theme';
import type { TextTone } from '../Text';

/**
 * How loudly a pill asks to be pressed, and on what it is drawn.
 *
 * Six and no more, in three pairs: one loud and one quiet for a light ground,
 * the same two for an espresso one, and two specials. A screen where every
 * button is coloured is a screen with no hierarchy at all, and a button that
 * picked its own colours would be the seventh pair by the end of the month.
 *
 * `surfaceLead` is the quiet one whose glyph is the primary brown rather than
 * the muted grey: for a row where the mark is what the reader is looking for
 * and the words only confirm it. `faint` is a control with nothing to do yet -
 * a send button over an empty box - which is a state rather than a level.
 *
 * `danger` is the seventh and belongs to no pair. It exists for deleting an
 * account and for nothing else: an app that painted more than one button red
 * would be one whose red means "important" rather than "this cannot be
 * undone".
 */
export type PillTone =
  'cream' | 'espresso' | 'lifted' | 'surface' | 'surfaceLead' | 'faint' | 'danger';

export const DEFAULT_PILL_TONE: PillTone = 'surface';

/**
 * What a pill with nothing to do yet is drawn as.
 *
 * A tone rather than an opacity: an espresso pill dimmed to 38% on a light
 * foot bar is a ghost of a button, and the one thing the screen most wants
 * pressed becomes the hardest thing on it to read. `faint` is the state this
 * list already had a name for.
 */
export const DISABLED_PILL_TONE: PillTone = 'faint';

export const PILL_BACKGROUNDS = {
  cream: 'cream',
  espresso: 'espresso',
  lifted: 'espressoLift',
  surface: 'surfaceVariant',
  surfaceLead: 'surfaceVariant',
  faint: 'outlineFaint',
  danger: 'error',
} as const satisfies Record<PillTone, keyof ColorPalette>;

/**
 * What a pill writes on its own fill.
 *
 * Every entry here has to be read against `PILL_BACKGROUNDS` above, because
 * three of those fills come from the espresso roles and are the same colour
 * in both schemes. `espresso` carried `onCream` - which is `#3B2415`, the
 * exact colour of the fill under it - so the loudest button in the app had an
 * invisible label in both schemes, and its glyph read as an off-centre mark
 * because the label was still there taking its width.
 */
export const PILL_LABEL_TONES = {
  cream: 'onCream',
  espresso: 'cream',
  lifted: 'onEspresso',
  surface: 'default',
  surfaceLead: 'default',
  faint: 'muted',
  danger: 'onError',
} as const satisfies Record<PillTone, TextTone>;

export const PILL_ICON_COLORS = {
  cream: 'onCream',
  espresso: 'cream',
  lifted: 'accentSoft',
  surface: 'onSurfaceVariant',
  surfaceLead: 'primary',
  faint: 'onSurfaceVariant',
  danger: 'onError',
} as const satisfies Record<PillTone, keyof ColorPalette>;

/**
 * The shadow a tone carries, or none.
 *
 * Only the two dark fills are lifted off what they sit on. A shadow under a
 * pill the same colour as its surroundings is one nobody sees, and a shadow
 * under every button would flatten the one that matters.
 */
export const PILL_ELEVATIONS = {
  cream: null,
  espresso: 'buttonDark',
  lifted: null,
  surface: null,
  surfaceLead: null,
  faint: null,
  danger: null,
} as const satisfies Record<PillTone, ElevationToken | null>;

/**
 * How big, which is a decision about the row a pill sits in rather than about
 * the pill.
 */
export type PillSize = 'large' | 'medium' | 'small' | 'compact';

export const DEFAULT_PILL_SIZE: PillSize = 'medium';

export const PILL_HEIGHTS = {
  large: 'pillLarge',
  medium: 'pillMedium',
  small: 'pillSmall',
  compact: 'pillCompact',
} as const satisfies Record<PillSize, SizeToken>;

export const PILL_LABEL_VARIANTS = {
  large: 'cardTitle',
  medium: 'rowTitle',
  small: 'actionLabel',
  compact: 'actionLabel',
} as const satisfies Record<PillSize, TypographyToken>;

export const PILL_ICON_SIZES = {
  large: 'iconLarge',
  medium: 'iconRow',
  small: 'iconRow',
  compact: 'iconLarge',
} as const satisfies Record<PillSize, SizeToken>;
