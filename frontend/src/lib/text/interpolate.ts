import { INTERPOLATION } from '../../constants/interpolation';

/** The values a translated sentence may have holes for. */
export type InterpolationValues = Readonly<Record<string, string | number>>;

/**
 * Fills the named holes in a translated sentence.
 *
 * A sentence like "chýba ti {count}" has to stay one string in the
 * translation file: Slovak puts the number in a different place from English
 * and a different place again from the plural, so cutting it into fragments
 * and concatenating them at the call site produces sentences no translator
 * ever saw.
 *
 * A name with no value is left as it was written, rather than replaced with an
 * empty space. A visible `{count}` is a bug somebody reports; a sentence with
 * a hole silently closed up is one nobody notices is wrong.
 */
export const interpolate = (template: string, values: InterpolationValues): string =>
  Object.entries(values).reduce(
    (text: string, [name, value]: readonly [string, string | number]): string =>
      text.split(`${INTERPOLATION.open}${name}${INTERPOLATION.close}`).join(String(value)),
    template,
  );
